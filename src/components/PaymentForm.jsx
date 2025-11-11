import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const PaymentForm = ({ role }) => {
  const [amount, setAmount] = useState(role === "owner" ? 1000 : 50);
  const [method, setMethod] = useState("PayPal");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1️⃣ Save payment details in Firestore
      await addDoc(collection(db, "payments"), {
        userId: auth.currentUser?.uid || "unknown",
        role,
        amount,
        method,
        status: "completed",
        timestamp: serverTimestamp(),
      });

      // 2️⃣ Simulate redirect to payment gateway (PayPal/M-Pesa)
      setTimeout(() => {
        setMessage(`✅ Payment of Ksh.${amount} via ${method} successful!`);
        setLoading(false);
      }, 1200);
    } catch (error) {
      setMessage("❌ Payment failed: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h3>{role === "owner" ? "Owner Listing Fee" : "Tenant Booking Fee"}</h3>
      <form onSubmit={handlePayment}>
        <p>Amount: <strong>Ksh.{amount}</strong></p>

        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="PayPal">PayPal</option>
          <option value="M-Pesa">M-Pesa</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : `Pay Now`}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default PaymentForm;