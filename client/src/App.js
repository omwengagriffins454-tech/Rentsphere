import React from 'react';
import PayPalButton from './components/PayPalButton';

function App() {
  return (
    <div>
      <h1>Welcome to Rentsphere</h1>
      <p>Connecting apartment owners and renters!</p>
      <h2>Test PayPal Payment</h2>
      <PayPalButton amount="10.00" /> {/* Example amount */}
    </div>
  );
}

export default App;