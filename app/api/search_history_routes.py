from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from app.models import Search, db
from datetime import datetime

search_history_routes = Blueprint('searches', __name__)

def page_not_found():
    response = make_response(jsonify({"error": "Sorry, the search you're looking for does not exist."}), 404)
    return response

# Get all searches of current user
@search_history_routes.route('/')
@login_required
def get_searches():
    searches = Search.query.filter_by(user_id=current_user.id).all()

    return jsonify([s.to_dict() for s in searches])

# Get search by id
@search_history_routes.route('/<int:id>')
@login_required
def get_search_by_id(id):
    search = Search.query.get(id)

    if search is None:
        return page_not_found()

    if search.user_id != current_user.id:
        return make_response(jsonify({'error': 'Search must belong to the current user'}), 403)

    return jsonify(search.to_dict())

# Create new search
@search_history_routes.route('/', methods=['POST'])
@login_required
def create_search():
    data = request.json
    search = data['search']
    num_pages = data.get('num_pages', 1)
    date_posted = data.get('date_posted', 'today')
    remote_only = data.get('remote_only', False)
    employment_types = data.get('employment_types', 'FULLTIME')
    experience = data.get('experience', 'under_3_years_experience,more_than_3_years_experience')
    radius = data.get('radius', 50)

    new_search = Search(
        user_id=current_user.id,
        search=search,
        num_pages=num_pages,
        date_posted=date_posted,
        remote_only=remote_only,
        employment_types=employment_types,
        experience=experience,
        radius=radius,
        created_at=datetime.utcnow()
    )
    db.session.add(new_search)
    db.session.commit()

    return jsonify(new_search.to_dict()), 201

# Delete search by id
@search_history_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_search(id):
    search = Search.query.get(id)

    if search is None:
        return page_not_found()

    if search.user_id != current_user.id:
        return make_response(jsonify({'error': 'Search must belong to the current user'}), 403)

    db.session.delete(search)
    db.session.commit()

    return jsonify({'message': 'Successfully deleted search'})
