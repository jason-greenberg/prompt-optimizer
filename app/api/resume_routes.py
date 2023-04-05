from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from app.models import Resume, CoverLetter, Application, db
from ..utils.gpt import generate_gpt_cover_letter
from datetime import datetime

resume_routes = Blueprint('resumes', __name__)

def page_not_found():
    response = make_response(jsonify({"error": "Sorry, the resume you're looking for does not exist."}), 404)
    return response

# Get all resumes of current user
@resume_routes.route('/')
@login_required
def get_resumes():
    """
    Query for all resumes and returns them in a list of resume dictionaries
    """
    resumes = Resume.query.filter_by(user_id=current_user.id).all()

    return [r.to_dict() for r in resumes]

# Get resume by id
@resume_routes.route('/<id>')
@login_required
def get_resume_by_id(id):
    """
    Query for a single resume by id
    """
    if id is None or id == "null":
    # Handle the case where the id is null buy sending an empty resume
        return make_response(jsonify({}), 200)

    resume = Resume.query.get(id)
    
    # Return 404 if cover letter not found
    if resume is None:
        return page_not_found()
    
    # Return 403 is cover letter does not belong to user
    if resume.user_id != current_user.id:
        return make_response(jsonify({'error': 'Resume must belong to the current user'}), 403)
    
    return resume.to_dict()

# Create new cover letter by resume id
@resume_routes.route('/<int:id>/coverletters', methods=['POST'])
@login_required
def create_new_cover_letter(id):
    """
    Creates a new cover letter by resume id.
    Expects a request body with 'job_title', 'job_description', 'company_details' and 'engine' attributes
    """
    resume = Resume.query.get(id)

    # Return 404 if resume does not exist in db
    if resume is None:
        return page_not_found()
    
    # Return 403 if resume does not belong to user
    if resume.user_id != current_user.id:
        return make_response(jsonify({'error': 'Resume must belong to the current user'}), 403)
    
    data = request.json
    job_description = data['job_description']
    company_details = data['company_details']
    engine=data['engine']
    job_title=data['job_title']

    # Generate a cover letter using OpenAI's API
    letter = generate_gpt_cover_letter(resume, job_description, company_details, engine, current_user)

    # Create new cover letter in db
    new_cover_letter = CoverLetter(
        user_id=current_user.id,
        letter_text=letter,
        engine=engine,
        job_description=job_description
    )
    db.session.add(new_cover_letter)
    db.session.commit()

    # Create a new application to coincide with new coverletter
    new_application = Application(
        user_id=current_user.id,
        resume_id=resume.id,
        cover_letter_id=new_cover_letter.id,
        job_title=job_title,
        job_description=job_description,
        position_type=resume.position_type,
        created_at=datetime.utcnow()
    )
    db.session.add(new_application)
    db.session.commit()


    # return new_cover_letter.to_dict()
    return {
        'coverletter': new_cover_letter.to_dict(),
        'application': new_application.to_dict()
    }, 201

# Create new cover letter by resume id (STANDALONE -- DOES NOT CREATE APPLICATION)
@resume_routes.route('/<int:id>/coverletters/standalone', methods=['POST'])
@login_required
def create_new_cover_letter_standalone(id):
    """
    Creates a new cover letter by resume id.
    Expects a request body with 'job_title', 'job_description', 'company_details' and 'engine' attributes
    """
    resume = Resume.query.get(id)

    # Return 404 if resume does not exist in db
    if resume is None:
        return page_not_found()
    
    # Return 403 if resume does not belong to user
    if resume.user_id != current_user.id:
        return make_response(jsonify({'error': 'Resume must belong to the current user'}), 403)
    
    data = request.json
    job_description = data['job_description']
    company_details = data['company_details']
    engine=data['engine']
    application_id=data['application_id']

    # Generate a cover letter using OpenAI's API
    letter = generate_gpt_cover_letter(resume, job_description, company_details, engine, current_user)

    # Create new cover letter in db
    new_cover_letter = CoverLetter(
        user_id=current_user.id,
        letter_text=letter,
        engine=engine,
        job_description=job_description
    )
    db.session.add(new_cover_letter)
    db.session.commit()

    # Update an existing application to reflect with new coverletter id
    existing_application = Application.query.get(application_id)
    if application_id is not None:
        existing_application.cover_letter_id = new_cover_letter.id
    db.session.commit()


    # return new_cover_letter.to_dict()
    return {
        'coverletter': new_cover_letter.to_dict(),
        'application': existing_application.to_dict()
    }, 201

# Create new resume
@resume_routes.route('/', methods=['POST'])
@login_required
def create_resume():
    """
    Creates a new resume
    Expects 'resume_text', 'position_type', and 'skill_level' in request body
    """
    data = request.json
    resume_text = data['resume_text']
    position_type = data['position_type']
    skill_level = data['skill_level']

    # Create new resume in db
    new_resume = Resume(
        user_id=current_user.id,
        resume_text=resume_text,
        position_type=position_type,
        skill_level=skill_level,
        created_at=datetime.utcnow()
    )
    db.session.add(new_resume)
    db.session.commit()

    return new_resume.to_dict(), 201

# Update resume by id
@resume_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_resume(id):
    """
    Updates a resume by id
    """
    resume = Resume.query.get(id)

    # Return 404 if resume not found
    if resume is None:
        return page_not_found()

    # Return 403 if resume does not belong to user
    if resume.user_id != current_user.id:
        return make_response(jsonify({'error': 'Resume must belong to the current user'}), 403)

    # Get updated data from request
    data = request.json
    resume_text = data.get('resume_text')
    position_type = data.get('position_type')
    skill_level = data.get('skill_level')

    # Update resume fields
    if resume_text is not None:
        resume.resume_text = resume_text
    if position_type is not None:
        resume.position_type = position_type
    if skill_level is not None:
        resume.skill_level = skill_level

    # Save changes to the database
    db.session.commit()

    return resume.to_dict()


# Delete resume by id
@resume_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_resume(id):
    """
    Deletes a resume by id
    """
    resume = Resume.query.get(id)

    # Return 404 if resume not found
    if resume is None:
        return page_not_found()
    
    # Return 403 if resume does not belong to user
    if resume.user_id != current_user.id:
        return make_response(jsonify({'error': 'Resume must belong to the current user'}), 403)
    
    # Delete resume
    db.session.delete(resume)
    db.session.commit()

    return { 'message': 'Successfully deleted resume' }

    
