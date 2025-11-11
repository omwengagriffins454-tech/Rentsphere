export async function createOrderServer(amount, listingId, userId) {
  const resp = await fetch("/api/paypal/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency: "USD", listingId, userId }),
  });
  return resp.json();
}

export async function captureOrderServer(orderId, listingId, userId) {
  const resp = await fetch("/api/paypal/capture-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, listingId, userId }),
  });
  return resp.json();
}

export async function requestMpesaSTK(phone, amount, listingId, userId) {
  const resp = await fetch("/api/mpesa/stkpush", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, amount, listingId, userId }),
  });
  return resp.json();
}