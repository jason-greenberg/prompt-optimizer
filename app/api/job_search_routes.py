from flask import Blueprint, jsonify, make_response, request, redirect
from flask_login import login_required, current_user
import os
import uuid
from app.models import db, User
from google.cloud import talent_v4 as jobs_v4
from google.oauth2 import service_account

job_search_routes = Blueprint('job_search', __name__)

# Google Cloud Project ID
PROJECT_ID = os.environ.get('GOOGLE_CLOUD_PROJECT')
# Set the path to the JSON key file
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.environ.get('GOOGLE_PATH')
# Set website domain
DOMAIN = os.environ.get('REACT_APP_BASE_URL')

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

    # Construct a location filter
    location_filter = jobs_v4.LocationFilter(
        address=location,
        distance_in_miles=radius
    )

    # Construct a job query
    job_query = jobs_v4.JobQuery(
        query=query,
        location_filters=[location_filter],
        employment_types=[job_type],
    )

    # Construct request metadata
    request_metadata = jobs_v4.RequestMetadata(
        user_id=str(current_user.id),
        session_id=str(uuid.uuid4()),
        domain=DOMAIN
    )

    # Construct a search jobs request
    search_jobs_request = jobs_v4.SearchJobsRequest(
        parent=f"projects/{PROJECT_ID}",
        request_metadata=request_metadata,
        job_query=job_query,
        max_page_size=limit,
        page_token=start,
        enable_broadening=True,
        histogram_queries=[],
        job_view=jobs_v4.JobView.JOB_VIEW_FULL,
        order_by="posting_publish_time desc",
        disable_keyword_match=True
    )

    # Call the search jobs API
    search_jobs_response = client.search_jobs(
        request=search_jobs_request
    )

    # Return the results
    print(search_jobs_response)
    return None
