from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Resume(db.Model):
    __tablename__ = 'resumes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    resume_text = db.Column(db.Text, nullable=False)
    position_type = db.Column(db.String, nullable=True)
    skill_level = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    applications = db.relationship('Application', back_populates='resume')
    user = db.relationship('User', back_populates='resumes')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'resume_text': self.resume_text,
            'position_type': self.position_type,
            'skill_level': self.skill_level,
            'created_at': self.created_at
        }

    
