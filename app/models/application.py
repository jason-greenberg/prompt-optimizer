from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Application(db.Model):
    __tablename__ = 'applications'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    resume_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('resumes.id'), ondelete='CASCADE'), nullable=False)
    cover_letter_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('coverletters.id'), ondelete='CASCADE'), nullable=False)
    job_title = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)

    user = db.relationship('User', back_populates='applications')
    resume = db.relationship('Resume', back_populates='applications')
    cover_letter = db.relationship('CoverLetter', uselist=False, back_populates='application')
    correspondences = db.relationship('Correspondence', back_populates='application', cascade='all, delete')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'resume_id': self.resume_id,
            'cover_letter_id': self.cover_letter_id,
            'job_title': self.job_title,
            'created_at': self.created_at
        }
