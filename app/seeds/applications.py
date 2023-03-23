from app.models import db, Application, User, Resume, CoverLetter, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Adds application seed data
def seed_applications():
    demo = User.query.get(1)
    marnie = User.query.get(2)
    bobbie = User.query.get(3)

    demo_resume = Resume.query.filter_by(user_id=demo.id).first()
    marnie_resume = Resume.query.filter_by(user_id=marnie.id).first()
    bobbie_resume = Resume.query.filter_by(user_id=bobbie.id).first()
    demo_resumes = Resume.query.filter_by(user_id=demo.id).all()

    demo_coverletter = CoverLetter.query.filter_by(user_id=demo.id).first()
    marnie_coverletter = CoverLetter.query.filter_by(user_id=marnie.id).first()
    bobbie_coverletter = CoverLetter.query.filter_by(user_id=bobbie.id).first()

    demo_application = Application(
        user_id=demo.id, 
        resume_id=demo_resume.id,
        cover_letter_id=demo_coverletter.id,
        job_title='Software Engineer',
        position_type=demo_resume.position_type,
        created_at=datetime.utcnow()
    )

    marnie_application = Application(
        user_id=marnie.id,
        resume_id=marnie_resume.id,
        cover_letter_id=marnie_coverletter.id,
        job_title='Software Developer',
        position_type=marnie_resume.position_type,
        created_at=datetime.utcnow()
    )

    bobbie_application = Application(
        user_id=bobbie.id,
        resume_id=bobbie_resume.id,
        cover_letter_id=bobbie_coverletter.id,
        job_title='Project Manager',
        position_type=bobbie_resume.position_type,
        created_at=datetime.utcnow()
    )

    application1 = Application(
    user_id=demo.id,
    resume_id=demo_resumes[1].id,
    cover_letter_id=demo_coverletter.id,
    job_title='Software Engineer',
    position_type=demo_resumes[1].position_type,
    created_at=datetime.utcnow()
    )

    application2 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[4].id,
        cover_letter_id=demo_coverletter.id,
        job_title='Frontend Developer',
        position_type=demo_resumes[4].position_type,
        created_at=datetime.utcnow()
    )

    application3 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[6].id,
        cover_letter_id=bobbie_coverletter.id,
        job_title='Project Manager',
        position_type=demo_resumes[6].position_type,
        created_at=datetime.utcnow()
    )

    application4 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[4].id,
        cover_letter_id=demo_coverletter.id,
        job_title='Software Engineer',
        position_type=demo_resumes[4].position_type,
        created_at=datetime.utcnow()
    )

    application5 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[4].id,
        cover_letter_id=demo_coverletter.id,
        job_title='Frontend Developer',
        position_type=demo_resumes[4].position_type,
        created_at=datetime.utcnow()
    )

    application6 = Application(
        user_id=demo.id,
        resume_id=demo_resumes[0].id,
        cover_letter_id=demo_coverletter.id,
        job_title='Full Stack Developer',
        position_type=demo_resumes[0].position_type,
        created_at=datetime.utcnow()
    )


    db.session.add(demo_application)
    db.session.add(marnie_application)
    db.session.add(bobbie_application)
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
