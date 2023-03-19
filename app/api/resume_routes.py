from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import Resume

resume_routes = Blueprint('resumes', __name__)

# Get all resumes of current user
@resume_routes.route('/')
@login_required
def get_resumes():
    """
    Query for all resumes and returns them in a list of resume dictionaries
    """
    resumes = Resume.query.filter_by(user_id=current_user.id).all()

    return [r.to_dict() for r in resumes]
