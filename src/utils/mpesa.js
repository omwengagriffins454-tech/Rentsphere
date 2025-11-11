import axios from "axios";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

async function handleMpesaPayment(user, listing, amount) {
  // 1️⃣ Call your backend API or M-Pesa SDK for STK Push
  const response = await fetch("/api/mpesa", {
    method: "POST",
    body: JSON.stringify({ amount, phone: user.phone }),
    headers: { "Content-Type": "application/json" },
  });

  const result = await response.json();

  // 2️⃣ If payment success
  if (result.status === "Success") {
    await addDoc(collection(db, "payments"), {
      userName: user.name,
      userEmail: user.email,
      listingId: listing.id,
      method: "M-Pesa",
      amount: parseFloat(amount),
      status: "Success",
      timestamp: serverTimestamp(),
    });
    alert("M-Pesa payment successful and saved to Firestore!");
  }
}


const DARAJA_BASE_URL = "https://sandbox.safaricom.co.ke"; // change to production later

export async function initiateMpesaPayment(phone, amount) {
  try {
    // Normally, you'd call your backend for token security.
    const response = await axios.post(`${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      BusinessShortCode: "174379",
      Password: "YOUR_DARAJA_PASSWORD",
      Timestamp: "20250101010101",
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: "174379",
      PhoneNumber: phone,
      CallBackURL: "https://yourdomain.com/api/mpesa/callback",
      AccountReference: "Rentsphere",
      TransactionDesc: "Rentsphere Booking"
    });

    return response.data;
  } catch (err) {
    console.error("M-Pesa Error:", err);
    throw err;
  }
}