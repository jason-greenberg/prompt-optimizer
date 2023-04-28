from flask import jsonify, make_response
from app.models import db, Job
from datetime import datetime
from ..utils.gpt import generate_company_details

def page_not_found():
    response = make_response(jsonify({"error": "Sorry, the job you're looking for does not exist."}), 404)
    return response

def create_job_from_api_data(job_data, user_id):
    job = Job(
        user_id=user_id,
        job_title=job_data.get("job_title", ""),
        external_api_id=job_data.get("job_id", ""),
        job_description=job_data.get("job_description", ""),
        city=job_data.get("job_city", ""),
        state=job_data.get("job_state", ""),
        country=job_data.get("job_country", ""),
        apply_link=job_data.get("job_apply_link", ""),
        company_name=job_data.get("employer_name", ""),
        company_website=job_data.get("employer_website", ""),
        employment_type=job_data.get("job_employment_type", ""),
        job_min_salary=job_data.get("job_min_salary", ""),
        job_max_salary=job_data.get("job_max_salary", ""),
        job_salary_currency=job_data.get("job_salary_currency", ""),
        job_salary_period=job_data.get("job_salary_period", ""),
        publisher=job_data.get("job_publisher", ""),
        employer_logo=job_data.get("employer_logo", ""),
        posted_at=datetime.strptime(job_data.get("job_posted_at_datetime_utc", ""), "%Y-%m-%dT%H:%M:%S.%fZ")
    )
    return job

def add_company_details_async(job_id, current_user):
    job = Job.query.get(job_id)
    if job is None:
        return page_not_found()

    # Generate company details using OpenAI
    company_details = generate_company_details(job.company_name, 'gpt-3.5-turbo', current_user)

    job.company_details = company_details
    db.session.commit()

    return job.to_dict()
