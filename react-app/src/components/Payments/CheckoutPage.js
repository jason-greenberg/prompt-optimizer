import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './CheckoutPage.css'
import Navigation from '../Navigation';
import CustomCheckbox from '../Checkbox/CustomCheckbox';
import LoadingNoMessages from '../Loading/LoadingWithoutMessages';
import loadingGif from '../Loading/assets/loading.gif'

export default function CheckoutPage() {
  
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [apiId, setApiId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const stripePromise = loadStripe('pk_live_51MrpnaAshXPLTdi4lr93RvZdGp88S27nvaduOs5TcaAf2ZEG7GXhUt5oQPMZc8dw81dS1ylDrSkuT8fxDF8gQp1H00iHTsXG8g');
  const checkoutObj = {
    1: { id: 1, 'package': 'Basic', calls: 20, price: '$0.99', api_id: 'price_1MrqDSAshXPLTdi40vKdNhfZ' },
    2: { id: 2, 'package': 'Starter', calls: 100, price: '$3.99', api_id: 'price_1MrqFlAshXPLTdi4SVZJZvqk' },
    3: { id: 3, 'package': 'Pro', calls: 500, price: '$9.99', api_id: 'price_1MrqHhAshXPLTdi4XGFEtzGO' },
    4: { id: 4, 'package': 'Pro Plus', calls: 1000, price: '$14.99', api_id: 'price_1Msvl3AshXPLTdi4erkeVUZU' }
  }

  async function redirectToCheckout() {
    if (apiId !== null) {
      await setLoading(true);
      const response = await fetch('/api/payments/create', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ api_id: apiId, amount_generations: checkoutObj[selectedPackage].calls })
       });
      const data = await response.json();
      const sessionId = data.id;
    
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
    
      if (error) {
        console.error('Error redirecting to Stripe Checkout:', error.message);
      }
    }
  }

  const handlePackageClick = (plan) => {
    setSelectedPackage(plan.id);
    setApiId(plan.api_id);
  };

  return (
    <>
      <Navigation />
      <div className="checkout-page-container">
        <div className="checkout-page-body">
          <h4 className="checkout-table-title">Pick a Package</h4>
          <div className="purchase-desc">Select a package to load AI generations onto your account.</div>
          <div className="packages-grid">
            <div className="header-container">
              <div className="col-name package-title">Package Type</div>
              <div className="col-name gens-head">AI Generations</div>
              <div className="col-name price-head">Price</div>
            </div>
            <div className="applications-container">
              {Object.values(checkoutObj).map((plan) => (
                <div
                  key={plan.id}
                  className={"indiv-package" + (selectedPackage === plan.id ? ' selected-package' : '')}
                  onClick={() => handlePackageClick(plan)}
                >
                  <div className="checkbox">
                    <div 
                      className={`custom-checkbox ${ selectedPackage === plan.id ? 'custom-checkbox-checked' : 'custom-checkbox-unchecked'}`}
                    >
                    </div>
                  </div>
                  <div className="col-detail package-title">{plan.package}</div>
                  <div className="col-detail pack-price">
                    {plan.calls} <span className="gens">credits</span>
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
            { !loading && (
              <>
                Checkout
              </>
            )}
            { loading && (
              <>
                <img src={loadingGif} className='loading-checkout' alt="loading-gif" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
