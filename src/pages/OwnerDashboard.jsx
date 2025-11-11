import React from "react";
import LogoutButton from "../components/LogoutButton";
import OwnerListingForm from "../components/OwnerListingForm";
import PaymentForm from "../components/PaymentForm";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";

const OwnerDashboard = () => {
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="dashboard">
      <h2>🏠 Owner Dashboard</h2>
      <p>Welcome! Manage your property listings here.</p>
      <p>Pay a small fee to post new property listings.</p>

      <PaymentForm role="owner" />

      <button onClick={handleLogout}>Logout</button>
      <OwnerListingForm />
      <LogoutButton />
    </div>
  );
};

export default OwnerDashboard;