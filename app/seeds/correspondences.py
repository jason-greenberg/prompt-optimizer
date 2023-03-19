from app.models import db, Correspondence, User, Application, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Adds correspondence seed data
def seed_correspondences():
    demo = User.query.get(1)
    marnie = User.query.get(2)
    bobbie = User.query.get(3)

    demo_app = Application.query.filter_by(user_id=demo.id).first()
    marnie_app = Application.query.filter_by(user_id=marnie.id).first()
    bobbie_app = Application.query.filter_by(user_id=bobbie.id).first()

    demo_linkedin_corr = Correspondence(
        user_id=demo.id, 
        application_id=demo_app.id,
        type='LinkedIn',
        context='Sent LinkedIn message to recruiter',
        generated_response='Thanks for reaching out. I am interested in learning more about the opportunity.',
        created_at=datetime.utcnow()
    )

    demo_email_corr = Correspondence(
        user_id=demo.id, 
        application_id=demo_app.id,
        type='Email',
        context='Sent follow-up email to recruiter',
        generated_response='Thank you for getting back to me. I am excited about the opportunity and would be happy to discuss it further.',
        created_at=datetime.utcnow()
    )

    marnie_linkedin_corr = Correspondence(
        user_id=marnie.id, 
        application_id=marnie_app.id,
        type='LinkedIn',
        context='Sent LinkedIn message to hiring manager',
        generated_response='Thank you for your message. We are currently reviewing applications and will be in touch soon.',
        created_at=datetime.utcnow()
    )

    marnie_email_corr = Correspondence(
        user_id=marnie.id, 
        application_id=marnie_app.id,
        type='Email',
        context='Sent follow-up email to hiring manager',
        generated_response='Thank you for your email. I am still very interested in the opportunity and would love to discuss it further.',
        created_at=datetime.utcnow()
    )

    bobbie_linkedin_corr = Correspondence(
        user_id=bobbie.id, 
        application_id=bobbie_app.id,
        type='LinkedIn',
        context='Sent LinkedIn message to HR manager',
        generated_response='Thank you for reaching out. I would be happy to discuss my qualifications and experience further with you.',
        created_at=datetime.utcnow()
    )

    bobbie_email_corr = Correspondence(
        user_id=bobbie.id, 
        application_id=bobbie_app.id,
        type='Email',
        context='Sent follow-up email to HR manager',
        generated_response='Thank you for getting back to me. I would be excited to learn more about the opportunity and how I can contribute to the team.',
        created_at=datetime.utcnow()
    )

    db.session.add(demo_linkedin_corr)
    db.session.add(demo_email_corr)
    db.session.add(marnie_linkedin_corr)
    db.session.add(marnie_email_corr)
    db.session.add(bobbie_linkedin_corr)
    db.session.add(bobbie_email_corr)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the correspondences table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all
def undo_correspondences():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.correspondences RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM correspondences"))
        
    db.session.commit()
