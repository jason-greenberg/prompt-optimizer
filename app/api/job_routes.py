from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
import os
from datetime import datetime, timedelta
from sqlalchemy.exc import IntegrityError
import requests
from app.models import db, Job, User, Search
from ..utils.jsearch import create_job_from_api_data, add_company_details_async
from ..utils.gpt import generate_company_details

job_routes = Blueprint('job_routes', __name__)

RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY')
RAPIDAPI_HOST = os.environ.get('RAPIDAPI_HOST')
PUBLISHER_ID = os.environ.get('PUBLISHER_ID')

def page_not_found():
    response = make_response(jsonify({"error": "Sorry, the job you're looking for does not exist."}), 404)
    return response

@job_routes.route('/search', methods=['POST'])
@login_required
def search():
    """Search for jobs using JSearch via RapidAPI
    Ultra-Fast and Simple Job Search for jobs posted on LinkedIn, Indeed, Glassdoor, ZipRecruiter, BeBee and many others, all in a single API.
    Full documentation can be found here: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
    """
    user = User.query.get(current_user.id)
    search_data = request.get_json()

    # Get the user's most recent search
    most_recent_search = user.searches[-1] if user.searches else None

    # Check if the most recent search exists and matches the current search query
    if (most_recent_search is not None and 
        most_recent_search.search == search_data.get("search").lower() and
        datetime.utcnow() - most_recent_search.created_at <= timedelta(minutes=15)):

        # Return the jobs from the database associated with the user ID
        jobs = Job.query.filter_by(user_id=current_user.id).all()
        return jsonify([job.to_dict() for job in jobs])

    url = "https://jsearch.p.rapidapi.com/search"

    querystring = {
        "query": search_data.get("search", "Software Engineer in San Francisco, CA"),  # Free-form jobs search query. Highly recommended to include job title and location, eg. web development in chicago
        "page": search_data.get("page", 1),  # Page number of the results to return. Default is 1. Allowed values: 1-100
        "num_pages": search_data.get("num_pages", 1),  # Number of pages to return, starting from page. Allowed values: 1-20. Default: 1.
        "date_posted": search_data.get("date_posted"),  # Find jobs posted within the time specified. Allowed values: all, today, 3days, week, month. Default: all.
        "remote_jobs_only": search_data.get("remote_jobs_only", False),  # Find remote jobs only (work from home). Default: false.
        "employment_types": search_data.get("employment_types"),  # Find jobs of particular employment types, specified as a comma delimited list of the following values: FULLTIME, CONTRACTOR, PARTTIME, INTERN.
        "job_requirements": search_data.get("job_requirements"),  # Find jobs with specific requirements, specified as a comma delimited list of the following values: under_3_years_experience, more_than_3_years_experience, no_experience, no_degree.
        "categories": search_data.get("categories"),  # Find jobs in specific categories/industries - specified as a comma (,) separated list of categories filter values (i.e. filter value field) as returned by the Search Filters endpoint.
        "job_titles": search_data.get("job_titles"),  # Find jobs with specific job titles - specified as a comma (,) separated list of job_titles filter values (i.e. filter value field) as returned by the Search Filters endpoint.
        "company_types": search_data.get("company_types"),  # Find jobs posted by companies of certain types - specified as a comma (,) separated list of company_types filter values (i.e. filter value field) as returned by the Search Filters endpoint.
        "employer": search_data.get("employer"),  # Find jobs posted by specific employers - specified as a comma (,) separated list of employer filter values (i.e. filter value field) as returned by the Search Filters endpoint.
        "radius": search_data.get("radius")  # Return jobs within a certain distance from location as specified as part of the query (in km).
    }

    # Remove None values from the querystring
    querystring = {k: v for k, v in querystring.items() if v is not None}

    # If search query is not identical to the user's most recent search, delete all previous user search entries
    if most_recent_search is not None and most_recent_search.search.lower() != querystring.get("query").lower():
        # Delete all previous user job entries
        for job in user.jobs:
            db.session.delete(job)
        db.session.commit()

    headers = {
        "content-type": "application/octet-stream",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    }

    response = requests.get(url, headers=headers, params=querystring)

    # Add search_data to database as a new search for the user
    new_search = Search(
        user_id=current_user.id,
        search=search_data.get("search", "Software Engineer in San Francisco, CA"),
        num_pages=search_data.get("num_pages", "1"),
        date_posted=search_data.get("date_posted"),
        remote_only=search_data.get("remote_jobs_only", False),
        employment_types=search_data.get("employment_types"),
        experience=search_data.get("experience"),
        radius=search_data.get("radius", 50),
        created_at=datetime.utcnow()
    )
    db.session.add(new_search)
    db.session.commit()

    # For each job in the response, create a new Job object and add it to the database
    if response.status_code == 200:
        job_data_list = response.json().get('data', [])
        
        # Query the database to get all jobs associated with the current user
        existing_jobs = Job.query.filter_by(user_id=current_user.id).all()
        
        # Create a set of external API IDs of jobs that already exist in the user's database
        existing_job_ids = {job.external_api_id for job in existing_jobs}
        
        # Initialize an empty list to store new jobs
        new_jobs = []
        
        for job_data in job_data_list:
            # Check if the job's external API ID is not in the set of existing job IDs
            if job_data.get("job_id", "") not in existing_job_ids:
                # Create a new job from the API data
                job = create_job_from_api_data(job_data, current_user.id)
                db.session.add(job)
                new_jobs.append(job)
        
        # Commit the new jobs to the database
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return make_response(jsonify({"error": "Failed to add new jobs to the database"}), 500)
        
        # Convert the new Job objects to JSON
        new_jobs_json = [job.to_dict() for job in new_jobs]
            
        return jsonify(new_jobs_json)
    else:
        return make_response(jsonify({"error": "Failed to fetch job search results"}), response.status_code)

    
# Get all jobs of current user
@job_routes.route('/')
@login_required
def get_jobs():
    jobs = Job.query.filter_by(user_id=current_user.id).order_by(Job.posted_at.desc()).all()
    return [j.to_dict() for j in jobs]

# Get job by id
@job_routes.route('/<int:id>')
@login_required
def get_job_by_id(id):
    job = Job.query.get(id)

    if job is None:
        return page_not_found()

    if job.user_id != current_user.id:
        return make_response(jsonify({'error': 'Job must belong to the current user'}), 403)

    return job.to_dict()

# Create new job
@job_routes.route('/', methods=['POST'])
@login_required
def create_job():
    data = request.json
    new_job = Job(
        user_id=current_user.id,
        external_api_id=data.get('external_api_id', ""),
        job_title=data.get('job_title', ""),
        job_description=data.get('job_description', ""),
        company_details=data.get('company_details', ""),
        city=data.get('city', ""),
        state=data.get('state', ""),
        country=data.get('country', ""),
        apply_link=data.get('apply_link', ""),
        company_name=data.get('company_name', ""),
        company_website=data.get('company_website', ""),
        employment_type=data.get('employment_type', ""),
        publisher=data.get('publisher', ""),
        employer_logo=data.get('employer_logo', ""),
        posted_at=datetime.utcnow()
    )
    db.session.add(new_job)
    db.session.commit()

    return new_job.to_dict(), 201

# Add company details to job by id using OpenAI
@job_routes.route('/<int:id>/company_details', methods=['POST'])
@login_required
def add_company_details(id):

    job = Job.query.get(id)

    if job is None:
        return page_not_found()

    # Generate company details using OpenAI
    company_details = generate_company_details(job.company_name, 'gpt-3.5-turbo', current_user)

    job.company_details = company_details
    db.session.commit()

    return job.to_dict()

# Update job by id
@job_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_job(id):
    job = Job.query.get(id)

    if job is None:
        return page_not_found()

    if job.user_id != current_user.id:
        return make_response(jsonify({'error': 'Job must belong to the current user'}), 403)

    data = request.json
    for field in data:
        setattr(job, field, data[field])

    db.session.commit()

    return job.to_dict()

# Delete job by id
@job_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_job(id):
    job = Job.query.get(id)

    if job is None:
        return page_not_found()

    if job.user_id != current_user.id:
        return make_response(jsonify({'error': 'Job must belong to the current user'}), 403)

    db.session.delete(job)
    db.session.commit()

    return {'message': 'Successfully deleted job'}
