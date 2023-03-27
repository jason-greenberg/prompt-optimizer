from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from app.models import Application, Correspondence, Resume, db
from datetime import datetime
from ..utils.gpt import generate_gpt_correspondence

application_routes = Blueprint('applications', __name__)

def page_not_found():
    response = make_response(jsonify({"error": "Sorry, the application you're looking for does not exist."}), 404)
    return response

def correspondences_not_found():
    response = make_response(jsonify({"error": "Sorry, no correspondences were found for this application."}), 404)
    return response

# Get all applications of current user
@application_routes.route('/')
@login_required
def get_applications():
    """
    Query for all applications and returns them in a list of application dictionaries
    """
    applications = Application.query.filter_by(user_id=current_user.id).all()

    return [a.to_dict() for a in applications]

# Get application by id
@application_routes.route('/<int:id>')
@login_required
def get_application_by_id(id):
    """
    Query for a single application by id
    """
    application = Application.query.get(id)
    
    # Return 404 if application not found
    if application is None:
        return page_not_found()
    
    # Return 403 if application does not belong to user
    if application.user_id != current_user.id:
        return make_response(jsonify({'error': 'Application must belong to the current user'}), 403)
    
    return application.to_dict()

# Get all correspondences by application_id
@application_routes.route('/<int:application_id>/correspondences')
@login_required
def get_correspondences_by_application_id(application_id):
    """
    Query for all correspondences by application_id and return them in a list of correspondence dictionaries
    """
    application = Application.query.get(application_id)

    # Return 404 if application not found
    if application is None:
        return page_not_found()

    # Return 403 if application does not belong to user
    if application.user_id != current_user.id:
        return make_response(jsonify({'error': 'Application must belong to the current user'}), 403)

    correspondences = Correspondence.query.filter_by(application_id=application_id).all()

    # Return 404 if no correspondences found
    if not correspondences:
        return correspondences_not_found()

    return jsonify([c.to_dict() for c in correspondences])

# Create new application
@application_routes.route('/', methods=['POST'])
@login_required
def create_application():
    """
    Creates a new application
    Expects 'resume_id', 'cover_letter_id', and 'job_title' in request body
    """
    data = request.json
    resume_id = data.get('resume_id', None)
    cover_letter_id = data.get('cover_letter_id', None)
    job_title = data['job_title']
    job_description = data['job_description']

    # Fetch the associated resume
    resume = Resume.query.get(resume_id)

    # Create new application in db
    new_application = Application(
        user_id=current_user.id,
        resume_id=resume_id,
        cover_letter_id=cover_letter_id,
        job_title=job_title,
        job_description=job_description,
        position_type=resume.position_type if resume else None,
        created_at=datetime.utcnow()
    )
    db.session.add(new_application)
    db.session.commit()

    return new_application.to_dict(), 201


# Update application by id
@application_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_application(id):
    """
    Updates an application by id
    """
    application = Application.query.get(id)

    # Return 404 if application not found
    if application is None:
        return page_not_found()
    
    # Return 403 if resume does not belong to user
    if application.user_id != current_user.id:
        return make_response(jsonify({'error': 'Application must belong to the current user'}), 403)
    
    #Get updated data from request body
    data = request.json
    resume_id = data.get('resume_id')
    cover_letter_id = data.get('cover_letter_id')
    job_title = data.get('job_title')
    job_description = data.get('job_description')

    #Update application fields
    if resume_id is not None:
        application.resume_id = resume_id
    if cover_letter_id is not None:
        application.cover_letter_id = cover_letter_id
    if job_title is not None:
        application.job_title = job_title
    if job_description is not None:
        application.job_description = job_description
    
    # Save changes to the database
    db.session.commit()

    return application.to_dict()


# Create new correspondence by application id
@application_routes.route('/<int:application_id>/correspondences', methods=['POST'])
@login_required
def create_correspondence(application_id):
    """
    Creates a new correspondence
    Expects 'corr_type', 'context', and 'engine' in request body
    """
    data = request.json
    corr_type = data['corr_type']
    context = data['context']
    engine = data['engine']
    
    # GPT logic here
    generated_response = generate_gpt_correspondence(context, corr_type, engine)

    # Create new correspondence in db
    new_correspondence = Correspondence(
        user_id=current_user.id,
        application_id=application_id,
        corr_type=corr_type,
        context=context,
        generated_response=generated_response,
        created_at=datetime.utcnow()
    )
    db.session.add(new_correspondence)
    db.session.commit()

    return new_correspondence.to_dict(), 201

# Delete application by id
@application_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_application(id):
    """
    Deletes an application by id
    """
    application = Application.query.get(id)

    # Return 404 if application not found
    if application is None:
        return page_not_found()
    
    # Return 403 if application does not belong to user
    if application.user_id != current_user.id:
        return make_response(jsonify({'error': 'Application must belong to the current user'}), 403)
    
    # Delete application
    db.session.delete(application)
    db.session.commit()

    return { 'message': 'Successfully deleted application' }
