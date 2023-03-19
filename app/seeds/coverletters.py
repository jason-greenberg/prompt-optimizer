from app.models import db, CoverLetter, User, environment, SCHEMA
from sqlalchemy.sql import text

# Adds cover letter seed data
def seed_coverletters():
    demo = User.query.get(1)
    marnie = User.query.get(2)
    bobbie = User.query.get(3)

    demo_coverletter = CoverLetter(
        user_id=demo.id, 
        letter_text='Dear Hiring Manager,\n\nI am excited to apply for the Software Engineer position at your company. With my experience in full-stack web development and a passion for solving complex problems, I believe I would be a great addition to your team. Thank you for considering my application.\n\nSincerely,\nDemo',
        rating=4,
        engine='gpt-3.5-turbo',
        job_description='We are looking for a highly motivated software engineer to join our team. The ideal candidate has experience with full-stack web development and a passion for solving complex problems. This is a full-time position with competitive salary and benefits.'
    )

    marnie_coverletter = CoverLetter(
        user_id=marnie.id,
        letter_text='Dear Hiring Manager,\n\nI am writing to express my interest in the Software Developer position at your company. As a recent graduate with a degree in computer science and experience in software development internships, I am confident in my ability to contribute to your team. Thank you for your consideration.\n\nSincerely,\nMarnie',
        rating=3,
        engine='gpt-3.5-turbo',
        job_description='We are seeking a software developer to join our team. The ideal candidate has a degree in computer science and experience with software development. This is a full-time position with competitive salary and benefits.'
    )

    bobbie_coverletter = CoverLetter(
        user_id=bobbie.id,
        letter_text='Dear Hiring Manager,\n\nI am excited to apply for the Project Manager position at your company. With my experience leading teams and delivering successful projects, I am confident in my ability to help your organization achieve its goals. Thank you for considering my application.\n\nSincerely,\nBobbie',
        rating=5,
        engine='gpt-3.5-turbo',
        job_description='We are looking for a highly skilled project manager to join our team. The ideal candidate has experience leading teams and delivering successful projects. This is a full-time position with competitive salary and benefits.'
    )

    db.session.add(demo_coverletter)
    db.session.add(marnie_coverletter)
    db.session.add(bobbie_coverletter)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_coverletters():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.coverletters RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM coverletters"))
        
    db.session.commit()
