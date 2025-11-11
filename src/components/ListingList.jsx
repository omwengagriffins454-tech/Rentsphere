import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import PayPalButton from "./PayPalButton";
import { initiateMpesaPayment } from "../utils/mpesa";

export default function ListingList() {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [user, setUser] = useState({ name: "Demo User", email: "demo@rentsphere.com" }); 
  // Replace with actual logged-in user later

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "listings"), (snapshot) => {
      setListings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  // 🔹 Save payment details to Firestore
  const recordPayment = async (method, amount, listingId, status) => {
    await addDoc(collection(db, "payments"), {
      userName: user.name,
      userEmail: user.email,
      listingId,
      method,
      amount,
      status,
      timestamp: serverTimestamp(),
    });
  };

  const handlePaymentSuccess = async (details) => {
    const amount = selectedListing.price;
    await updateDoc(doc(db, "listings", selectedListing.id), { booked: true });
    await recordPayment("PayPal", amount, selectedListing.id, "Success");
    alert("🎉 Payment successful! Listing booked.");
    setShowPayment(false);
    setSelectedListing(null);
  };

  const handleBookClick = (listing) => {
    setSelectedListing(listing);
    setShowPayment(true);
  };

  const handleMpesaPayment = async () => {
    const phone = prompt("Enter your M-Pesa phone number (e.g., 2547xxxxxxx):");
    const amount = selectedListing.price;

    try {
      await initiateMpesaPayment(phone, amount);
      await updateDoc(doc(db, "listings", selectedListing.id), { booked: true });
      await recordPayment("M-Pesa", amount, selectedListing.id, "Initiated");
      alert("✅ M-Pesa payment initiated. Listing booked!");
      setShowPayment(false);
    } catch {
      await recordPayment("M-Pesa", amount, selectedListing.id, "Failed");
      alert("❌ M-Pesa payment failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏘 Available Listings</h2>

      {listings.filter((l) => !l.booked).map((listing) => (
        <div
          key={listing.id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
            borderRadius: "5px"
          }}
        >
          <h3>{listing.title}</h3>
          <p><strong>Location:</strong> {listing.location}</p>
          <p><strong>Price:</strong> Ksh {listing.price}</p>
          <p>{listing.description}</p>
          <button
            onClick={() => handleBookClick(listing)}
            style={{
              background: "#28a745",
              color: "white",
              padding: "6px 10px",
              borderRadius: "4px"
            }}
          >
            Book Now
          </button>
        </div>
      ))}

      {showPayment && selectedListing && (
        <div style={{ marginTop: "20px" }}>
          <h3>Complete your payment for {selectedListing.title}</h3>
          <PayPalButton
            amount={(selectedListing.price / 150).toFixed(2)} // Ksh → USD conversion
            onSuccess={handlePaymentSuccess}
          />
          <button
            onClick={handleMpesaPayment}
            style={{
              background: "#ffcc00",
              color: "black",
              padding: "8px",
              borderRadius: "5px",
              marginLeft: "10px"
            }}
          >
            Pay with M-Pesa
          </button>
        </div>
      )}
    </div>
  );
}