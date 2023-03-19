from .db import db, environment, SCHEMA, add_prefix_for_prod

class Application(db.Model):
    __tablename__ = 'applications'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    resume_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('resumes.id'), ondelete='CASCADE'), nullable=False)
    cover_letter_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('coverletters.id'), ondelete='CASCADE'), nullable=False)

    user = db.relationship('User', uselist=False, back_populates='applications')
    resume = db.relationship('Resume', uselist=False, back_populates='applications')
