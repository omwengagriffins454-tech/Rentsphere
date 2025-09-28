import React, { useEffect } from 'react';

const PayPalButton = ({ amount }) => {
  useEffect(() => {
    const script = document.createElement('script');
    // Use your actual PayPal client ID later!
    script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID";
    script.async = true;
    script.onload = () => {
      window.paypal.Buttons({
        createOrder: function(data, actions) {
          // Call backend to create the order
          return fetch('/api/paypal/create-order', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
          }).then(res => res.json())
            .then(data => data.id);
        },
        onApprove: function(data, actions) {
          // Capture the order via backend
          return fetch('/api/paypal/capture-order', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderID: data.orderID })
          }).then(res => res.json())
            .then(details => {
              alert('Transaction completed by ' + details.payer.name.given_name);
            });
        }
      }).render('#paypal-button-container');
    };
    document.body.appendChild(script);
  }, [amount]);

  return <div id="paypal-button-container"></div>;
};

export default PayPalButton;