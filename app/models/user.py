from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    generation_balance = db.Column(db.Integer, default=0, nullable=False)

    applications = db.relationship('Application', back_populates='user')
    cover_letters = db.relationship('CoverLetter', back_populates='user')
    resumes = db.relationship('Resume', back_populates='user')
    correspondences = db.relationship('Correspondence', back_populates='user')
    transactions = db.relationship('Transaction', back_populates='user')
    jobs = db.relationship('Job', back_populates='user')

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'generation_balance': self.generation_balance
        }
