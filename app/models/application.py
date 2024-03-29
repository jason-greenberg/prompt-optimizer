from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Application(db.Model):
    __tablename__ = 'applications'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    resume_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('resumes.id'), ondelete='CASCADE'), nullable=True)
    cover_letter_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('coverletters.id'), ondelete='SET NULL'), nullable=True)
    job_title = db.Column(db.String, nullable=False)
    job_description = db.Column(db.String, nullable=False)
    company_details = db.Column(db.String, nullable=True)
    position_type = db.Column(db.String, nullable=True)
    follow_up = db.Column(db.Boolean, default=False)
    apply_link = db.Column(db.String, nullable=True)
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
            'position_type': self.position_type,
            'follow_up': self.follow_up,
            'apply_link': self.apply_link,
            'created_at': self.created_at,
            'job_description': self.job_description if self.job_description else None,
            'company_details': self.company_details if self.company_details else None
        }
