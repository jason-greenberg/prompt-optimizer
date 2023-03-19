from app.models import db, Resume, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Adds resume seed data
def seed_resumes():
    demo = User.query.get(1)
    marnie = User.query.get(2)
    bobbie = User.query.get(3)

    demo_resume = Resume(
        user_id=demo.id, 
        resume_text='I am an experienced software engineer with a background in full-stack web development.',
        position_type='Software Engineer',
        skill_level='Senior',
        created_at=datetime.utcnow()
    )

    marnie_resume = Resume(
        user_id=marnie.id,
        resume_text='I am a recent graduate with a degree in computer science and experience in software development internships.',
        position_type='Software Developer',
        skill_level='Entry-Level',
        created_at=datetime.utcnow()
    )

    bobbie_resume = Resume(
        user_id=bobbie.id,
        resume_text='I am a skilled project manager with experience leading teams and delivering successful projects.',
        position_type='Project Manager',
        skill_level='Senior',
        created_at=datetime.utcnow()
    )

    db.session.add(demo_resume)
    db.session.add(marnie_resume)
    db.session.add(bobbie_resume)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_resumes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.resumes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM resumes"))
        
    db.session.commit()
