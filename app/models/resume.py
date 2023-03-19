from .db import db, environment, SCHEMA, add_prefix_for_prod

class Resume(db.Model):
    __tablename__ = 'resumes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeighKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    resume_text = db.Column(db.Text, nullable=False)
    position_type = db.Column(db.String, nullable=True)
    skill_level = db.Column(db.String, nullable=True)

    applications = db.relationship('Application', back_populates='resume')
    

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'resume_text': self.resume_text,
            'position_type': self.position_type,
            'skill_level': self.skill_level
        }

    
