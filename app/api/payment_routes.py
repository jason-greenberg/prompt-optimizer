from flask import Blueprint, jsonify, make_response, request, redirect
from flask_login import login_required, current_user
from app.models import db
import stripe
import os

payment_routes = Blueprint('payments', __name__)

stripe.api_key = os.getenv('STRIPE_API_KEY')

YOUR_DOMAIN = 'http://localhost:8000'

# Create checkout session
@payment_routes.route('/create', methods=['POST'])
@login_required
def create_checkout_session():
    """
    Create a new checkout session with stripe
    """
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items = [
                { 
                    'price': 'price_1MrqDSAshXPLTdi40vKdNhfZ',
                    'quantity': 1
                }
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '/success',
            cancel_url=YOUR_DOMAIN + '/cancel'
        )
    except Exception as e:
        return str(e)
    
    return { 'message': 'success' }
