from .db import db, environment, SCHEMA, add_prefix_for_prod

class CoverLetter(db.Model):
    __tablename__ = 'coverletters'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id'), ondelete='CASCADE'), nullable=False)
    letter_text = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    engine = db.Column(db.String, nullable=False)
    job_description = db.Column(db.Text, nullable=False)

    application = db.relationship('Application', uselist=False, back_populates='cover_letter')
    user = db.relationship('User', uselist=False, back_populates='cover_letters')
    

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'letter_text': self.letter_text,
            'rating': self.rating,
            'engine': self.engine,
            'job_description': self.job_description
        }
