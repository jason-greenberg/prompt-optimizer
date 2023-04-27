from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Search(db.Model):
    __tablename__ = 'searches'

    if environment == "production":
        __table_args__ = (
            {'schema': SCHEMA},
        )
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=True)
    query = db.Column(db.String, nullable=False)
    num_pages = db.Column(db.Integer, default=1, nullable=False)
    date_posted = db.Column(db.String, default='today', nullable=False)
    remote_only = db.Column(db.Boolean, default=False, nullable=False)
    employment_types = db.Column(db.String, default='FULLTIME', nullable=False)
    experience = db.Column(db.String, default='under_3_years_experience,more_than_3_years_experience', nullable=False)
    radius = db.Column(db.Integer, default=50, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)

    user = db.relationship('User', back_populates='searches')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'query': self.query,
            'num_pages': self.num_pages,
            'date_posted': self.date_posted,
            'remote_only': self.remote_only,
            'employment_types': self.employment_types,
            'experience': self.experience,
            'radius': self.radius,
            'created_at': self.created_at
        }
