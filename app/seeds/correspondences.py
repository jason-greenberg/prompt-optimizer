from app.models import db, Correspondence, User, Application, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Adds correspondence seed data
def seed_correspondences():
    demo = User.query.get(1)

    demo_app = Application.query.filter_by(user_id=demo.id).first()

    demo_linkedin_corr = Correspondence(
        user_id=demo.id, 
        application_id=demo_app.id,
        corr_type='LinkedIn',
        context='Sent LinkedIn message to recruiter',
        generated_response='Thanks for reaching out. I am interested in learning more about the opportunity.',
        created_at=datetime.utcnow()
    )

    demo_email_corr = Correspondence(
        user_id=demo.id, 
        application_id=demo_app.id,
        corr_type='Email',
        context='Sent follow-up email to recruiter',
        generated_response='Thank you for getting back to me. I am excited about the opportunity and would be happy to discuss it further.',
        created_at=datetime.utcnow()
    )

    db.session.add(demo_linkedin_corr)
    db.session.add(demo_email_corr)
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
