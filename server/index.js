const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

// PayPal credentials (fill these in with your own later)
const PAYPAL_CLIENT_ID = 'YOUR_PAYPAL_CLIENT_ID';
const PAYPAL_SECRET = 'YOUR_PAYPAL_SECRET';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com'; // Sandbox endpoint

// Get PayPal access token
const getAccessToken = async () => {
  const response = await axios({
    url: `${PAYPAL_API}/v1/oauth2/token`,
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_SECRET
    },
    params: {
      grant_type: 'client_credentials'
    }
  });
  return response.data.access_token;
};

// Create order
app.post('/api/paypal/create-order', async (req, res) => {
  const { amount } = req.body;
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount
        }
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    res.json({ id: response.data.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Capture order
app.post('/api/paypal/capture-order', async (req, res) => {
  const { orderID } = req.body;
  try {
    const accessToken = await getAccessToken();
    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api', (req, res) => {
  res.json({ message: "Welcome to Rentsphere API!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
