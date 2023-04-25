from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
import os
from datetime import datetime
import requests
from app.models import db, Job, User
from ..utils.jsearch import create_job_from_api_data

job_search_routes = Blueprint('job_search', __name__)

RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY')
RAPIDAPI_HOST = os.environ.get('RAPIDAPI_HOST')
PUBLISHER_ID = os.environ.get('PUBLISHER_ID')

def page_not_found():
    response = make_response(jsonify({"error": "Sorry, the job you're looking for does not exist."}), 404)
    return response

@job_search_routes.route('/search', methods=['POST'])
@login_required
def search():
    """Search for jobs using JSearch via RapidAPI
    Ultra-Fast and Simple Job Search for jobs posted on LinkedIn, Indeed, Glassdoor, ZipRecruiter, BeBee and many others, all in a single API.
    Full documentation can be found here: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
    """
    search_data = request.get_json()

    url = "https://jsearch.p.rapidapi.com/search"

    querystring = {
        "query": search_data.get("query", "Software Engineer in San Francisco, CA"),  # Free-form jobs search query. Highly recommended to include job title and location, eg. web development in chicago
        "page": search_data.get("page", "1"),  # Page number of the results to return. Default is 1. Allowed values: 1-100
        "num_pages": search_data.get("num_pages", "1"),  # Number of pages to return, starting from page. Allowed values: 1-20. Default: 1.
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

    headers = {
        "content-type": "application/octet-stream",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    }

    response = requests.get(url, headers=headers, params=querystring)

    if response.status_code == 200:
        job_data_list = response.json().get('data', [])
        for job_data in job_data_list:
            job.user_id = current_user.id
            job = create_job_from_api_data(job_data)
            db.session.add(job)
        db.session.commit()

        # Get the length of the response array
        num_recent_jobs = len(job_data_list)

        # Query the job table for the most recent jobs that match the length of the response array
        recent_jobs = Job.query.filter_by(user_id=current_user.id).order_by(Job.id.desc()).limit(num_recent_jobs).all()

        # Convert the Job objects to JSON
        recent_jobs_json = [job.to_dict() for job in recent_jobs]

        return jsonify(recent_jobs_json)
    else:
        return make_response(jsonify({"error": "Failed to fetch job search results"}), response.status_code)

    
# Get all jobs of current user
@job_search_routes.route('/')
@login_required
def get_jobs():
    jobs = Job.query.filter_by(user_id=current_user.id).all()
    return [j.to_dict() for j in jobs]

# Get job by id
@job_search_routes.route('/<int:id>')
@login_required
def get_job_by_id(id):
    job = Job.query.get(id)

    if job is None:
        return page_not_found()

    if job.user_id != current_user.id:
        return make_response(jsonify({'error': 'Job must belong to the current user'}), 403)

    return job.to_dict()

# Create new job
@job_search_routes.route('/', methods=['POST'])
@login_required
def create_job():
    data = request.json
    new_job = Job(
        user_id=current_user.id,
        job_title=data['job_title'],
        job_description=data['job_description'],
        company_details=data['company_details'],
        city=data['city'],
        state=data['state'],
        country=data['country'],
        apply_link=data['apply_link'],
        company_name=data['company_name'],
        company_website=data['company_website'],
        employment_type=data['employment_type'],
        publisher=data['publisher'],
        employer_logo=data['employer_logo'],
        posted_at=datetime.utcnow()
    )
    db.session.add(new_job)
    db.session.commit()

    return new_job.to_dict(), 201

# Update job by id
@job_search_routes.route('/<int:id>', methods=['PUT'])
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
@job_search_routes.route('/<int:id>', methods=['DELETE'])
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
