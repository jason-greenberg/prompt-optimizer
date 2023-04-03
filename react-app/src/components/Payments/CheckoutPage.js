import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './CheckoutPage.css'
import Navigation from '../Navigation';

const stripePromise = loadStripe('pk_live_51MrpnaAshXPLTdi4lr93RvZdGp88S27nvaduOs5TcaAf2ZEG7GXhUt5oQPMZc8dw81dS1ylDrSkuT8fxDF8gQp1H00iHTsXG8g');

async function redirectToCheckout() {
  const response = await fetch('/api/payments/create', { method: 'POST' });
  const data = await response.json();
  const sessionId = data.id;

  const stripe = await stripePromise;
  const { error } = await stripe.redirectToCheckout({ sessionId });

  if (error) {
    console.error('Error redirecting to Stripe Checkout:', error.message);
  }
}

export default function CheckoutPage() {

  const [selectedPackage, setSelectedPackage] = useState(null);

  const checkoutObj = {
    1: { id: 1, 'package': 'Basic Package', calls: 20, price: '$0.99' },
    2: { id: 2, 'package': 'Pro Package', calls: 100, price: '$3.99' },
    3: { id: 3, 'package': 'Elite Package', calls: 500, price: '$9.99' },
  }

  const handlePackageClick = (planId) => {
    setSelectedPackage(planId);
  }

  return (
    <>
      <Navigation />
      <div className="checkout-page-container">
        <div className="checkout-page-body">
          <h4 className="checkout-table-title">Pick a Package</h4>
          <div className="packages-grid">
            <div className="header-container">
              <div className="col-name package-title">Package Type</div>
              <div className="col-name">AI Generations</div>
              <div className="col-name">Price</div>
            </div>
            <div className="applications-container">
              {Object.values(checkoutObj).map((plan) => (
                <div
                  key={plan.id}
                  className={"indiv-package" + (selectedPackage === plan.id ? ' selected-package' : '')}
                  onClick={() => handlePackageClick(plan.id)}
                >
                  <div className="checkbox">
                    <input
                      type="radio"
                      checked={selectedPackage === plan.id}
                      readOnly
                    />
                  </div>
                  <div className="package-title col-detail">{plan.package}</div>
                  <div className="col-detail">
                    {plan.calls} <span className="gens">gens</span>
                  </div>
                  <div className="col-detail">{plan.price}</div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={redirectToCheckout}
            className="create-button checkout-button"
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}
