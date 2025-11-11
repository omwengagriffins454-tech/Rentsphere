import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
dotenv.config();

const Environment =
  process.env.PAYPAL_MODE === "live"
    ? checkoutNodeJssdk.core.SandboxEnvironment // intentionally sandbox for safety; switch in production
    : checkoutNodeJssdk.core.SandboxEnvironment;

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(
    new Environment(clientId, clientSecret)
  );
}

export async function createPayPalOrder({ amount, currency = "USD" }) {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: { currency_code: currency, value: amount.toString() },
      },
    ],
  });
  const response = await client().execute(request);
  return response;
}

export async function capturePayPalOrder(orderId) {
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  const response = await client().execute(request);
  return response;
}