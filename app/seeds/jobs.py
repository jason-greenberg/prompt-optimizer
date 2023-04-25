from app.models import db, Job, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Adds job seed data
def seed_jobs():
    demo = User.query.get(1)

    job1 = Job(
        user_id=demo.id,
        external_api_id='j1',
        job_title='Software Engineer',
        job_description='Develop software solutions...',
        company_details='A leading software company...',
        city='New York',
        state='NY',
        country='USA',
        apply_link='https://example.com/apply',
        company_name='Example Company',
        company_website='https://example.com',
        employment_type='Full-time',
        publisher='Indeed',
        employer_logo='https://example.com/logo.png',
        posted_at=datetime.utcnow()
    )

    job2 = Job(
        user_id=demo.id,
        external_api_id='j2',
        job_title='Frontend Developer',
        job_description='Create user interfaces...',
        company_details='A top web development firm...',
        city='San Francisco',
        state='CA',
        country='USA',
        apply_link='https://example2.com/apply',
        company_name='Example Company 2',
        company_website='https://example2.com',
        employment_type='Full-time',
        publisher='LinkedIn',
        employer_logo='https://example2.com/logo.png',
        posted_at=datetime.utcnow()
    )

    job3 = Job(
        user_id=demo.id,
        external_api_id='j3',
        job_title='Backend Developer',
        job_description='Develop server-side applications...',
        company_details='A leading backend services company...',
        city='Austin',
        state='TX',
        country='USA',
        apply_link='https://example3.com/apply',
        company_name='Example Company 3',
        company_website='https://example3.com',
        employment_type='Full-time',
        publisher='Alice Johnson',
        employer_logo='https://example3.com/logo.png',
        posted_at=datetime.utcnow()
    )

    job4 = Job(
        user_id=demo.id,
        external_api_id='j4',
        job_title='Fullstack Developer',
        job_description='Develop fullstack applications...',
        company_details='A top data analysis company...',
        city='Seattle',
        state='WA',
        country='USA',
        apply_link='https://example4.com/apply',
        company_name='Example Company 4',
        company_website='https://example4.com',
        employment_type='Full-time',
        publisher='Dice',
        employer_logo='https://example4.com/logo.png',
        posted_at=datetime.utcnow()
    )

    job5 = Job(
        user_id=demo.id,
        external_api_id='j5',
        job_title='Lead FS Developer',
        job_description='Lead a team of fullstack developers...',
        company_details='A well-established project management firm...',
        city='Chicago',
        state='IL',
        country='USA',
        apply_link='https://example5.com/apply',
        company_name='Example Company 5',
        company_website='https://example5.com',
        employment_type='Full-time',
        publisher='Indeed',
        employer_logo='https://example5.com/logo.png',
        posted_at=datetime.utcnow()
    )

    db.session.add(job1)
    db.session.add(job2)
    db.session.add(job3)
    db.session.add(job4)
    db.session.add(job5)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the jobs table. SQLAlchemy doesn't
# have a built-in function to do this. With PostgreSQL in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities. With
# SQLite3 in development, you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_jobs():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.jobs RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM jobs"))

    db.session.commit()
