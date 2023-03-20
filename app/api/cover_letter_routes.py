from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from app.models import CoverLetter, db

cover_letter_routes = Blueprint('coverletters', __name__)

def page_not_found():
    response = make_response(jsonify({"error": "Sorry, the coverletter you're looking for does not exist."}), 404)
    return response

# Get all cover letters of current user
@cover_letter_routes.route('/')
@login_required
def get_cover_letters():
    """
    Query for all coverletters and returns them in a list of coverletter dictionaries
    """
    cover_letters = CoverLetter.query.filter_by(user_id=current_user.id).all()

    return [c.to_dict() for c in cover_letters]

# Get cover letter by id
@cover_letter_routes.route('/<int:id>')
@login_required
def get_cover_by_id(id):
    """
    Query for a single cover letter by id
    """
    cover_letter = CoverLetter.query.get(id)
    
    # Return 404 if cover letter not found
    if cover_letter is None:
        return page_not_found()
    
    # Return 403 is cover letter does not belong to user
    if cover_letter.user_id != current_user.id:
        return make_response(jsonify({'error': 'Cover letter must belong to the current user'}), 403)
    
    return cover_letter.to_dict()
