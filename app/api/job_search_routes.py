from flask import Blueprint, jsonify, make_response, request, redirect
from flask_login import login_required, current_user
import os
from app.models import db, User
from google.cloud import talent_v4beta1 as jobs_v4
from google.oauth2 import service_account

job_search_routes = Blueprint('job_search', __name__)

# Set the path to the JSON key file
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'credentials/zipcover-710dc6cb8394.json'

# Search Google Cloud Jobs API based on user request body
@job_search_routes.route('/search', methods=['POST'])
@login_required
def search():
    data = request.json
    query = data['query']
    location = data['location']
    job_type = data['job_type']
    radius = data['radius']
    limit = data['limit']
    start = data['start']

    # Create a client object
    client = jobs_v4.JobServiceClient()

    # Construct a company name filter
    company_name_filter = jobs_v4.CompanyNameFilter(
        company_names=[query]
    )

    # Construct a location filter
    location_filter = jobs_v4.LocationFilter(
        addresses=[location],
        distance_in_miles=radius
    )

    # Construct a job title filter
    job_title_filter = jobs_v4.JobTitleFilter(
        job_titles=[query]
    )

    # Construct a job type filter
    job_type_filter = jobs_v4.JobTypeFilter(
        job_types=[job_type]
    )

    # Construct a compensation filter
    compensation_filter = jobs_v4.CompensationFilter(
        include_jobs_with_unspecified_compensation_range=True
    )

    # Construct a job query
    job_query = jobs_v4.JobQuery(
        company_names=[query],
        company_display_names=[query],
        location_filters=[location_filter],
        query=query,
        job_title_filters=[job_title_filter],
        job_type_filters=[job_type_filter],
        compensation_filters=[compensation_filter]
    )

    # Construct a search jobs request
    search_jobs_request = jobs_v4.SearchJobsRequest(
        job_query=job_query,
        page_size=limit,
        page_token=start,
        require_precise_result_size=True,
        histogram_queries=[],
        job_view=jobs_v4.JobView.JOB_VIEW_FULL,
        order_by=jobs_v4.JobView.JOB_VIEW_FULL,
        disable_keyword_match=True
    )

    # Call the search jobs API
    search_jobs_response = client.search_jobs(
        request=search_jobs_request
    )

    # Return the results
    return search_jobs_response
