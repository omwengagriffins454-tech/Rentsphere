# Rentsphere

A web app connecting apartment owners and renters.

## Project Structure

- `client/` — React frontend
- `server/` — Node.js/Express backend (API + PayPal integration)

## Getting Started

### Backend

1. Go to `server/`
2. Run `npm install`
3. Add your PayPal credentials to `index.js`:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_SECRET`
4. Start the server: `npm run dev`

### Frontend

1. Go to `client/`
2. Run `npm install`
3. Add your PayPal Client ID in `src/components/PayPalButton.js`
4. Start the frontend: `npm start`

## PayPal Integration

PayPal credentials are **placeholders**. Replace them with your own from [PayPal Developer Dashboard](https://developer.paypal.com/) for live payment capability.

---

## Next Steps

- Build authentication (owners/renters)
- Create apartment listing and browsing features
- Implement messaging/contact between users
