import React, { useEffect } from "react";

const ListingCard = ({ listing, userId, onBooked }) => {
  useEffect(() => {
    // load PayPal Buttons dynamically only when needed
    if (!window.paypal) return;

    // create order on server when PayPal SDK calls createOrder
    window.paypal.Buttons({
      createOrder: async (data, actions) => {
        const serverResp = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: (listing.bookingFeeUsd || "0.35"), // USD amount
            listingId: listing.id,
            userId,
          }),
        });
        const json = await serverResp.json();
        return json.orderId;
      },
      onApprove: async (data, actions) => {
        // capture on server
        const captureResp = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID, listingId: listing.id, userId }),
        });
        const captureJson = await captureResp.json();
        if (captureJson.success) {
          // refresh listings or call onBooked
          onBooked(listing.id);
        } else {
          alert("Payment capture failed");
        }
      },
      onError: (err) => {
        console.error(err);
        alert("PayPal error");
      },
    }).render(`#paypal-button-${listing.id}`);
  }, [listing.id]);

  const handleMpesa = async () => {
    const phone = prompt("Enter your phone in format 2547xxxxxxx");
    if (!phone) return;
    const resp = await fetch("/api/mpesa/stkpush", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, amount: listing.bookingFeeKsh || 50, listingId: listing.id, userId }),
    });
    const json = await resp.json();
    if (json.success) {
      alert("M-Pesa STK push initiated — check your phone.");
      // wait for callback to mark booking, or poll for status
    } else {
      alert("M-Pesa initiation failed");
    }
  };

  return (
    <div>
      <h3>{listing.title}</h3>
      <p>Ksh {listing.price}</p>
      <div id={`paypal-button-${listing.id}`}></div>
      <button onClick={handleMpesa}>Pay with M-Pesa</button>
    </div>
  );
};

export default ListingCard;