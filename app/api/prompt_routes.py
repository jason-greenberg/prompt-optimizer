from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from app.models import Prompt, db
from datetime import datetime

prompt_routes = Blueprint('prompt', __name__)

def page_not_found():
    response = make_response(jsonify({"error": "Sorry, the search you're looking for does not exist."}), 404)
    return response

# Get all prompts of current user
@prompt_routes.route('/')
@login_required
def get_prompts():
    prompts = Prompt.query.filter_by(user_id=current_user.id).all()

    return jsonify([p.to_dict() for p in prompts])

# Get prompt by id
@prompt_routes.route('/<int:id>')
@login_required
def get_prompt_by_id(id):
    prompt = Prompt.query.get(id)

    if prompt is None:
        return page_not_found()

    if prompt.user_id != current_user.id:
        return make_response(jsonify({'error': 'Prompt must belong to the current user'}), 403)

    return jsonify(prompt.to_dict())

# Get most recent prompt of current user
@prompt_routes.route('/recent')
@login_required
def get_recent_prompt():
    prompt = Prompt.query.filter_by(user_id=current_user.id).order_by(Prompt.created_at.desc()).first()

    if prompt is None:
        return page_not_found()

    return jsonify(prompt.to_dict())

# Create new prompt
@prompt_routes.route('/', methods=['POST'])
@login_required
def create_prompt():
    data = request.json
    prompt = data['prompt']

    new_prompt = Prompt(
        user_id=current_user.id,
        prompt=prompt,
        created_at=datetime.utcnow()
    )
    db.session.add(new_prompt)
    db.session.commit()

    return jsonify(new_prompt.to_dict()), 201

# Delete prompt by id
@prompt_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_prompt(id):
    prompt = Prompt.query.get(id)

    if prompt is None:
        return page_not_found()

    if prompt.user_id != current_user.id:
        return make_response(jsonify({'error': 'Prompt must belong to the current user'}), 403)

    db.session.delete(prompt)
    db.session.commit()

    return jsonify({'message': 'Successfully deleted prompt'})
