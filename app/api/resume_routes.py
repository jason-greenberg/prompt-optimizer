from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from app.models import Resume, CoverLetter, db

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

from ..utils.gpt import call_gpt
from ..utils.prompts import prompt_one, prompt_two
# Create new cover letter by resume id
@resume_routes.route('/<int:id>/coverletters', methods=['POST'])
@login_required
def create_new_cover_letter(id):
    """
    Creates a new cover letter by resume id.
    Expects a request body with 'job_title', 'job_description', and 'company_details' attributes
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

    # Call gpt api here
    response = 'Test'
    engine='gpt-3.5-turbo'

    # Create new cover letter in db
    new_cover_letter = CoverLetter(
        user_id=current_user.id,
        letter_text=response,
        engine=engine,
        job_description=job_description
    )
    db.session.add(new_cover_letter)
    # db.session.commit()

    messages=[
        {"role": "system", "content": "You will act as an expert in editing cover letters for junior web developers, who wants to include detail about why, on a personal interest level, a candidate is a good fit for a role."},
        {"role": "user", "content": prompt_one(resume, job_description)},
        {"role": "assistant", "content": 'Assitant generates a cover letter here'},
        {"role": "user", "content": prompt_two(company_details)}
    ]

    output = call_gpt(messages)

    # return new_cover_letter.to_dict()
    return jsonify(output)
