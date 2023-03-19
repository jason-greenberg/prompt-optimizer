from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from app.models import Resume, CoverLetter, Application, db

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

from ..utils.gpt import generate_gpt_cover_letter
from datetime import datetime
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
    letter = generate_gpt_cover_letter(resume, job_description, company_details, engine)

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
        created_at=datetime.utcnow()
    )
    db.session.add(new_application)
    db.session.commit()


    # return new_cover_letter.to_dict()
    return {
        'coverletter': new_cover_letter.to_dict(),
        'application': new_application.to_dict()
    }
