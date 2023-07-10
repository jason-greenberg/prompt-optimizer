from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Prompt(db.Model):
    __tablename__ = 'prompts'

    if environment == "production":
        __table_args__ = (
            {'schema': SCHEMA},
        )
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    prompt = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)

    user = db.relationship('User', back_populates='prompts')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'prompt': self.prompt,
            'created_at': self.created_at
        }
