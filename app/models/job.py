from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from sqlalchemy.schema import UniqueConstraint

class Job(db.Model):
    __tablename__ = 'jobs'

    if environment == "production":
        __table_args__ = (
            UniqueConstraint('user_id', 'external_api_id', name='user_external_api_unique'),
            {'schema': SCHEMA},
        )
    else:
        __table_args__ = (
            UniqueConstraint('user_id', 'external_api_id', name='user_external_api_unique'),
        )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=True)
    external_api_id = db.Column(db.String, nullable=False)
    job_title = db.Column(db.String, nullable=False)
    job_description = db.Column(db.Text, nullable=False)
    company_details = db.Column(db.Text, nullable=True)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    country = db.Column(db.String, nullable=False)
    apply_link = db.Column(db.String, nullable=False)
    company_name = db.Column(db.String, nullable=False)
    company_website = db.Column(db.String, nullable=True)
    employment_type = db.Column(db.String, nullable=False)
    publisher = db.Column(db.String, nullable=False)
    employer_logo = db.Column(db.String, nullable=True)
    posted_at = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)

    user = db.relationship('User', back_populates='jobs')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'job_title': self.job_title,
            'job_description': self.job_description,
            'company_details': self.company_details,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'apply_link': self.apply_link,
            'company_name': self.company_name,
            'company_website': self.company_website,
            'employment_type': self.employment_type,
            'publisher': self.publisher,
            'employer_logo': self.employer_logo,
            'posted_at': self.posted_at
        }
