from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from app.models import Correspondence, db
from datetime import datetime

correspondence_routes = Blueprint('correspondences', __name__)

def page_not_found():
    response = make_response(jsonify({"error": "Sorry, the correspondence you're looking for does not exist."}), 404)
    return response

# Get all correspondences of current user
@correspondence_routes.route('/')
@login_required
def get_correspondences():
    """
    Query for all correspondences and returns them in a list of correspondence dictionaries
    """
    correspondences = Correspondence.query.filter_by(user_id=current_user.id).all()

    return [c.to_dict() for c in correspondences]

# Get correspondence by id
@correspondence_routes.route('/<int:id>')
@login_required
def get_correspondence_by_id(id):
    """
    Query for a single correspondence by id
    """
    correspondence = Correspondence.query.get(id)
    
    # Return 404 if correspondence not found
    if correspondence is None:
        return page_not_found()
    
    # Return 403 if correspondence does not belong to user
    if correspondence.user_id != current_user.id:
        return make_response(jsonify({'error': 'Correspondence must belong to the current user'}), 403)
    
    return correspondence.to_dict()

# Get all correspondences by application_id
@correspondence_routes.route('/application/<int:application_id>')
@login_required
def get_correspondences_by_application_id(application_id):
    """
    Query for all correspondences related to a specific application and returns them in a list of correspondence dictionaries
    """
    correspondences = Correspondence.query.filter_by(application_id=application_id, user_id=current_user.id).all()

    return jsonify([c.to_dict() for c in correspondences])


# Update correspondence by id
@correspondence_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_correspondence(id):
    """
    Updates a correspondence by id
    """
    correspondence = Correspondence.query.get(id)

    # Return 404 if correspondence not found
    if correspondence is None:
        return page_not_found()

    # Return 403 if correspondence does not belong to user
    if correspondence.user_id != current_user.id:
        return make_response(jsonify({'error': 'Correspondence must belong to the current user'}), 403)

    # Get updated data from request body
    data = request.json
    corr_type = data.get('corr_type', None)
    context = data.get('context', None)
    generated_response = data.get('generated_response', None)

    # Update correspondence fields
    if corr_type is not None:
        correspondence.corr_type = corr_type
    if context is not None:
        correspondence.context = context
    if generated_response is not None:
        correspondence.generated_response = generated_response

    # Save changes to the database
    db.session.commit()

    return correspondence.to_dict()


# Delete correspondence by id
@correspondence_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_correspondence(id):
    """
    Deletes a correspondence by id
    """
    correspondence = Correspondence.query.get(id)

    # Return 404 if correspondence not found
    if correspondence is None:
        return page_not_found()
    
    # Return 403 if correspondence does not belong to user
    if correspondence.user_id != current_user.id:
        return make_response(jsonify({'error': 'Correspondence must belong to the current user'}), 403)
    
    # Delete correspondence
    db.session.delete(correspondence)
    db.session.commit()

    return { 'message': 'Successfully deleted correspondence' }
