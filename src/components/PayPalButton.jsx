import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const PayPalPayment = ({ user, listing }) => {
  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  const handlePaymentSuccess = async (details) => {
    const payer = details.payer.name.given_name;
    const amount = details.purchase_units[0].amount.value;

    await addDoc(collection(db, "payments"), {
      userName: payer,
      userEmail: details.payer.email_address,
      listingId: listing.id,
      method: "PayPal",
      amount: parseFloat(amount),
      status: "Success",
      timestamp: serverTimestamp(),
    });
    alert("Payment successful and saved to Firestore!");
  }}

  export default function PayPalButton({ amount, onSuccess }) {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: { value: listing.price.toString() },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
            return actions.order.capture().then(handlePaymentSuccess);
        }}
      />
    </PayPalScriptProvider>
  );
}