from app.models import db, CoverLetter, User, environment, SCHEMA
from sqlalchemy.sql import text

# Adds cover letter seed data
def seed_coverletters():
    demo = User.query.get(1)

    demo_coverletter = CoverLetter(
        user_id=demo.id, 
        letter_text='Dear Hiring Manager,\n\nI am excited to apply for the Software Engineer position at your company. With my experience in full-stack web development and a passion for solving complex problems, I believe I would be a great addition to your team. Thank you for considering my application.\n\nSincerely,\nDemo',
        rating=4,
        engine='gpt-3.5-turbo',
        job_description='We are looking for a highly motivated software engineer to join our team. The ideal candidate has experience with full-stack web development and a passion for solving complex problems. This is a full-time position with competitive salary and benefits.'
    )

    coverletter1 = CoverLetter(
        user_id=1,
        letter_text='Dear Hiring Manager,\n\nI am excited to apply for the Software Engineer position at your company. With my experience in full-stack web development and a passion for creating innovative software solutions, I believe I would be a valuable asset to your team. Thank you for considering my application.\n\nSincerely,\nJohn',
        rating=4,
        engine='gpt-3.5-turbo',
        job_description='We are seeking a highly motivated software engineer to join our team. The ideal candidate has experience with full-stack web development and a passion for creating innovative software solutions. This is a full-time position with competitive salary and benefits.'
    )

    coverletter2 = CoverLetter(
        user_id=1,
        letter_text='Dear Hiring Manager,\n\nI am writing to express my interest in the Frontend Developer position at your company. With my experience in creating responsive and intuitive user interfaces, I am confident that I would be a great addition to your team. Thank you for your consideration.\n\nSincerely,\nJohn',
        rating=3,
        engine='gpt-3.5-turbo',
        job_description='We are seeking a frontend developer to join our team. The ideal candidate has experience with frontend technologies and a passion for creating intuitive and responsive user interfaces. This is a full-time position with competitive salary and benefits.'
    )

    coverletter3 = CoverLetter(
        user_id=1,
        letter_text='Dear Hiring Manager,\n\nI am excited to apply for the Full Stack Developer position at your company. With my experience in building scalable and robust applications, I am confident that I would be a great addition to your team. Thank you for considering my application.\n\nSincerely,\nJohn',
        rating=5,
        engine='gpt-3.5-turbo',
        job_description='We are looking for a full stack developer to join our team. The ideal candidate has experience with backend and frontend technologies and a passion for building scalable and robust applications. This is a full-time position with competitive salary and benefits.'
    )

    db.session.add(demo_coverletter)
    db.session.add(coverletter1)
    db.session.add(coverletter2)
    db.session.add(coverletter3)
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
