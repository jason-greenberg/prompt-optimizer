from flask import Blueprint, jsonify, make_response, request, redirect
from flask_login import login_required, current_user
from app.models import db, User, Transaction
import stripe
import os

payment_routes = Blueprint('payments', __name__)

stripe.api_key = os.getenv('STRIPE_API_KEY')
environment = os.getenv("FLASK_ENV")
url = os.getenv("REACT_APP_BASE_URL")
STRIPE_WEBHOOK_SECRET=os.getenv('STRIPE_WEBHOOK_SECRET')
STRIPE_LOCAL_WEBHOOK=os.getenv('STRIPE_LOCAL_WEBHOOK')

# Create checkout session
@payment_routes.route('/create', methods=['POST'])
@login_required
def create_checkout_session():
    data = request.json
    api_id = data['api_id']
    amount_generations = data['amount_generations']

    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    'price': api_id,
                    'quantity': 1
                }
            ],
            mode='payment',
            success_url=url + '/success',
            cancel_url=url + '/cancel',
            allow_promotion_codes=True,
            metadata={'user_id': str(current_user.id), 'amount_generations': str(amount_generations)}
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    return jsonify({'id': checkout_session.id, 'message': 'success'})


# Transactions webhook
@payment_routes.route("/webhook", methods=["POST"])
def webhook_received():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")

    try:
        if environment == 'production':
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        elif environment == 'development':
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_LOCAL_WEBHOOK
            )
    except ValueError as e:
        # Invalid payload
        return "Invalid payload", 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return "Invalid signature", 400

     # Handle the checkout.session.completed event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        print('session', session)

        # Extract the necessary information from the session object
        user_id = session["metadata"]["user_id"]
        amount_generations = int(session["metadata"]["amount_generations"])

        # Extract the product_id and the corresponding cost
        product_id = session["line_items"]["data"][0]["price"]["id"]
        cost = session["line_items"]["data"][0]["price"]["unit_amount"] / 100

        # Determine the purchased product
        package = get_package_details(product_id)

        # Update the user's generation balance and create a transaction record
        update_user_generation_balance_and_create_transaction(user_id, package, amount_generations, cost)

    return "Success", 200

def get_package_details(product_id):
    # Define product IDs and their corresponding package details
    product_mapping = {
        "price_1MrqDSAshXPLTdi40vKdNhfZ": "basic",
        "price_1MrqFlAshXPLTdi4SVZJZvqk": "starter",
        "price_1MrqHhAshXPLTdi4XGFEtzGO": "pro",
        "price_1Msvl3AshXPLTdi4erkeVUZU": "pro_plus"
    }
    return product_mapping.get(product_id, None)


def update_user_generation_balance_and_create_transaction(user_id, package, amount_generations, cost):
    # Fetch the user from the database
    user = User.query.get(user_id)

    if user and package:
        # Update the user's generation balance
        user.generation_balance += amount_generations

        # Create a new transaction object
        transaction = Transaction(
            user_id=user_id,
            package=package,
            amount_generations=amount_generations,
            cost=cost
        )

        # Add the transaction to the database
        db.session.add(transaction)

        # Commit the changes
        db.session.commit()
