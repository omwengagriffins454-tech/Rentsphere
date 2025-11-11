import React, { useState } from "react";
import ListingCard from "./ListingCard";
import LogoutButton from "../components/LogoutButton";
import ListingList from "../components/ListingList";
import PaymentForm from "../components/PaymentForm";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const TenantDashboard = () => {
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="dashboard">
      <h2>👤 Tenant Dashboard</h2>
      <p>Pay Ksh.50 to confirm your booking for a house.</p>

      <PaymentForm role="tenant" />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
{
  const [listings, setListings] = useState([
    { id: 1, title: "Studio Apartment", description: "1 bed, WiFi", price: "8000", bookingFee: "50" },
    { id: 2, title: "1 Bedroom", description: "Near CBD", price: "12000", bookingFee: "100" },
  ]);

  const handleBooked = (listingId) => {
    setListings(listings.filter((l) => l.id !== listingId));
  };

  return (
    <div>
      <h1>Tenant Dashboard</h1>
      <p>Welcome! View and manage your bookings here</p>
      <h2>Available Apartments</h2>
      <ListingList />
      <LogoutButton />
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} onBooked={handleBooked} />
      ))}
    </div>
  );
};

export default TenantDashboard;