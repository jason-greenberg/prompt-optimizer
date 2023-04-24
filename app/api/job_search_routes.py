from flask import Blueprint, jsonify, make_response, request, redirect
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




# from google.cloud import talent_v4 as jobs_v4
# from google.oauth2 import service_account


# # Google Cloud Project ID
# PROJECT_ID = os.environ.get('GOOGLE_CLOUD_PROJECT')
# # Set the path to the JSON key file
# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.environ.get('GOOGLE_PATH')
# # Set website domain
# DOMAIN = os.environ.get('REACT_APP_BASE_URL')

# # Search Google Cloud Jobs API based on user request body
# @job_search_routes.route('/search', methods=['POST'])
# @login_required
# def search():
#     data = request.json
#     query = data['query']
#     location = data['location']
#     job_type = data['job_type']
#     radius = data['radius']
#     limit = data['limit']
#     start = data['start']

#     # Create a client object
#     client = jobs_v4.JobServiceClient()

#     # Construct a location filter
#     location_filter = jobs_v4.LocationFilter(
#         address=location,
#         distance_in_miles=radius
#     )

#     # Construct a job query
#     job_query = jobs_v4.JobQuery(
#         query=query,
#         location_filters=[location_filter],
#         employment_types=[job_type],
#     )

#     # Construct request metadata
#     request_metadata = jobs_v4.RequestMetadata(
#         user_id=str(current_user.id),
#         session_id=str(uuid.uuid4()),
#         domain=DOMAIN
#     )

#     # Construct a search jobs request
#     search_jobs_request = jobs_v4.SearchJobsRequest(
#         parent=f"projects/{PROJECT_ID}",
#         request_metadata=request_metadata,
#         job_query=job_query,
#         max_page_size=limit,
#         page_token=start,
#         enable_broadening=True,
#         histogram_queries=[],
#         job_view=jobs_v4.JobView.JOB_VIEW_FULL,
#         order_by="posting_publish_time desc",
#         disable_keyword_match=True
#     )

#     # Call the search jobs API
#     search_jobs_response = client.search_jobs(
#         request=search_jobs_request
#     )

#     # Return the results
#     print(search_jobs_response)
#     return None
