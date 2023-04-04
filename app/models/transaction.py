from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    package = db.Column(db.String, nullable=False)
    amount_generations = db.Column(db.String, nullable=False)
    cost = db.Column(db.Float(asdecimal=True, decimal_return_scale=2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow(), nullable=False)

    user = db.relationship('User', back_populates='transactions')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'package': self.package,
            'amount_generations': self.amount_generations,
            'cost': self.cost,
            'created_at': self.created_at
        }
