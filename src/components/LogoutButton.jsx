import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userRole"); // clear saved role
      navigate("/login");
    } catch (err) {
      alert("Logout failed: " + err.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 20px",
        backgroundColor: "#d9534f",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}