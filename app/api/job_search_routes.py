from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
import os
import requests
from app.models import db, User

job_search_routes = Blueprint('job_search', __name__)


RAPIDAPI_KEY = os.environ.get('RAPIDAPI_KEY')
RAPIDAPI_HOST = os.environ.get('RAPIDAPI_HOST')
PUBLISHER_ID = os.environ.get('PUBLISHER_ID')

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
        return jsonify(response.json())
    else:
        return make_response(jsonify({"error": "Failed to fetch job search results"}), response.status_code)
