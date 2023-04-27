# searches.py
from app.models import db, Search, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Adds search seed data
def seed_searches():
    demo = User.query.get(1)

    search1 = Search(
        user_id=demo.id,
        search='Software Engineer in San Francisco, CA',
        num_pages=2,
        date_posted='today',
        remote_only=False,
        employment_types='FULLTIME',
        experience='under_3_years_experience,more_than_3_years_experience',
        radius=50
    )

    search2 = Search(
        user_id=demo.id,
        search='Frontend Developer in New York, NY',
        num_pages=1,
        date_posted='3days',
        remote_only=True,
        employment_types='FULLTIME,PARTTIME',
        experience='under_3_years_experience',
        radius=25
    )

    db.session.add(search1)
    db.session.add(search2)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the searches table. SQLAlchemy doesn't
# have a built-in function to do this. With PostgreSQL in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities. With
# SQLite3 in development, you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_searches():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.searches RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM searches"))

    db.session.commit()
