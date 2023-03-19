from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Correspondence(db.Model):
    __tablename__ = 'correspondences'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    application_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('applications.id'), ondelete='CASCADE'), nullable=False)
    type = db.Column(db.String, nullable=True)
    context = db.Column(db.Text, nullable=False)
    generated_response = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)

    user = db.relationship('User', back_populates='correspondences')
    application = db.relationship('Application', back_populates='correspondences')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'application_id': self.application_id,
            'type': self.type,
            'context': self.context,
            'generated_response': self.generated_response,
            'created_at': self.created_at
        }
