import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MB_URL = process.env.MPESA_BASE_URL || "https://sandbox.safaricom.co.ke";
const SHORTCODE = process.env.MPESA_SHORTCODE;
const PASSKEY = process.env.MPESA_PASSKEY;
const CALLBACK_BASE = process.env.MPESA_CALLBACK_BASE_URL;

export async function getMpesaToken() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;

  const tokenUrl = `${MB_URL}/oauth/v1/generate?grant_type=client_credentials`;
  const response = await axios.get(tokenUrl, {
    auth: { username: key, password: secret },
  });
  return response.data.access_token;
}

export async function initiateStkPush({ token, phone, amount, listingId, userId }) {
  // Format phone to 2547XXXXXXXX
  const sanitizedPhone = phone.toString().startsWith("0")
    ? "254" + phone.toString().slice(1)
    : phone.toString().startsWith("254")
    ? phone.toString()
    : phone.toString();

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14); // YYYYMMDDHHmmss
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString("base64");

  const url = `${MB_URL}/mpesa/stkpush/v1/processrequest`;
  const body = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: sanitizedPhone,
    PartyB: SHORTCODE,
    PhoneNumber: sanitizedPhone,
    CallBackURL: `${CALLBACK_BASE}/api/mpesa/callback`,
    AccountReference: listingId,
    TransactionDesc: `Booking for listing ${listingId}`,
  };

  const resp = await axios.post(url, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Return response (contains CheckoutRequestID) — save it in payments collection to link callback
  return resp.data;
}