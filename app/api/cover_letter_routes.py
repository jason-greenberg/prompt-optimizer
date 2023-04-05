from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from app.models import CoverLetter, Application, db

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
@cover_letter_routes.route('/<id>')
@login_required
def get_cover_by_id(id):
    """
    Query for a single cover letter by id
    """
    if id is None or id == "null":
    # Handle the case where the id is null buy sending an empty cover letter
        return make_response(jsonify({}), 200)
    
    cover_letter = CoverLetter.query.get(id)
    
    # Return 404 if cover letter not found
    if cover_letter is None:
        return page_not_found()
    
    # Return 403 is cover letter does not belong to user
    if cover_letter.user_id != current_user.id:
        return make_response(jsonify({'error': 'Cover letter must belong to the current user'}), 403)
    
    return cover_letter.to_dict()

# Update cover letter by id
@cover_letter_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_cover_letter(id):
    """
    Updates a cover_letter by id
    """
    cover_letter = CoverLetter.query.get(id)

    # Return 404 if cover_letter not found
    if cover_letter is None:
        return page_not_found()

    # Return 403 if cover_letter does not belong to user
    if cover_letter.user_id != current_user.id:
        return make_response(jsonify({'error': 'Cover letter must belong to the current user'}), 403)

    # Get updated data from request
    data = request.json
    letter_text = data.get('letter_text')
    rating = data.get('rating')
    engine = data.get('engine')
    job_description = data.get('job_description')

    # Update cover_letter fields
    if letter_text is not None:
        cover_letter.letter_text = letter_text
    if rating is not None:
        cover_letter.rating = rating
    if engine is not None:
        cover_letter.engine = engine
    if job_description is not None:
        cover_letter.job_description = job_description

    # Save changes to the database
    db.session.commit()

    return cover_letter.to_dict()


# Delete cover letter by id
@cover_letter_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_cover_letter(id):
    """
    Deletes a cover_letter by id
    """
    cover_letter = CoverLetter.query.get(id)

    # Return 404 if cover_letter not found
    if cover_letter is None:
        return page_not_found()
    
    # Return 403 if cover_letter does not belong to user
    if cover_letter.user_id != current_user.id:
        return make_response(jsonify({'error': 'Cover letter must belong to the current user'}), 403)
    
    # Set the associated applications' cover_letter_id to None
    associated_applications = Application.query.filter(Application.cover_letter_id == cover_letter.id).all()
    for application in associated_applications:
        application.cover_letter_id = None
        db.session.add(application)
    
    # Delete cover_letter
    db.session.delete(cover_letter)
    db.session.commit()

    return { 'message': 'Successfully deleted cover letter' }
