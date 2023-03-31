from flask import Blueprint, jsonify, make_response, request
from flask_login import login_required, current_user
from app.models import db
import stripe
import os

payment_routes = Blueprint('payments', __name__)

stripe.api_key = os.getenv('STRIPE_API_KEY')

# Create checkout session
@payment_routes.route('/create', methods=['POST'])
@login_required
def create_checkout_session():
    """
    Create a new checkout session with stripe
    """
    