from app.models import db, Application, User, Resume, CoverLetter, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Adds application seed data
def seed_applications():
    demo = User.query.get(1)

    demo_resume = Resume.query.filter_by(user_id=demo.id).first()
    demo_resumes = Resume.query.filter_by(user_id=demo.id).all()

    demo_coverletters = CoverLetter.query.filter_by(user_id=demo.id).all()

    demo_application = Application(
        user_id=demo.id, 
        resume_id=demo_resume.id,
        cover_letter_id=demo_coverletters[0].id,
        job_title='Software Engineer',
        job_description=demo_coverletters[0].job_description,
        company_details=demo_coverletters[0].company_details,
        position_type=demo_resume.position_type,
        follow_up=True,
        apply_link='https://www.linkedin.com/jobs/view/1234567890/',
        created_at=datetime.utcnow()
    )

    application1 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[1].id,
        cover_letter_id=demo_coverletters[0].id,
        job_title='Software Engineer',
        job_description=demo_coverletters[0].job_description,
        company_details=demo_coverletters[0].company_details,
        position_type=demo_resumes[1].position_type,
        follow_up=True,
        apply_link='https://www.indeed.com/jobs/view/2345678901/',
        created_at=datetime.utcnow()
    )

    application2 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[4].id,
        cover_letter_id=demo_coverletters[1].id,
        job_title='Frontend Developer',
        job_description=demo_coverletters[1].job_description,
        company_details=demo_coverletters[1].company_details,
        position_type=demo_resumes[4].position_type,
        follow_up=True,
        apply_link='https://www.glassdoor.com/Job/Listing/345678901/',
        created_at=datetime.utcnow()
    )

    application3 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[6].id,
        cover_letter_id=demo_coverletters[3].id,
        job_title='Project Manager',
        job_description=demo_coverletters[3].job_description,
        company_details=demo_coverletters[3].company_details,
        position_type=demo_resumes[6].position_type,
        follow_up=True,
        apply_link='https://www.monster.com/jobs/view/4567890123/',
        created_at=datetime.utcnow()
    )

    application4 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[4].id,
        cover_letter_id=demo_coverletters[2].id,
        job_title='Software Engineer',
        job_description=demo_coverletters[2].job_description,
        company_details=demo_coverletters[2].company_details,
        position_type=demo_resumes[4].position_type,
        follow_up=True,
        apply_link='https://www.simplyhired.com/job/5678901234/',
        created_at=datetime.utcnow()
    )

    application5 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[4].id,
        cover_letter_id=demo_coverletters[3].id,
        job_title='Frontend Developer',
        job_description=demo_coverletters[3].job_description,
        company_details=demo_coverletters[3].company_details,
        position_type=demo_resumes[4].position_type,
        follow_up=True,
        apply_link='https://www.linkedin.com/jobs/view/6789012345/',
        created_at=datetime.utcnow()
    )

    application6 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[0].id,
        cover_letter_id=demo_coverletters[0].id,
        job_title='Full Stack Developer',
        job_description=demo_coverletters[0].job_description,
        company_details=demo_coverletters[0].company_details,
        position_type=demo_resumes[0].position_type,
        follow_up=True,
        apply_link='https://www.indeed.com/jobs/view/7890123456/',
        created_at=datetime.utcnow()
    )

    db.session.add(demo_application)
    db.session.add(application1)
    db.session.add(application2)
    db.session.add(application3)
    db.session.add(application4)
    db.session.add(application5)
    db.session.add(application6)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the applications table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_applications():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.applications RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM applications"))
        
    db.session.commit()
