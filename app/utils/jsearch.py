from app.models import Job
from datetime import datetime

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
        publisher=job_data.get("job_publisher", ""),
        employer_logo=job_data.get("employer_logo", ""),
        posted_at=datetime.strptime(job_data.get("job_posted_at_datetime_utc", ""), "%Y-%m-%dT%H:%M:%S.%fZ")
    )
    return job
