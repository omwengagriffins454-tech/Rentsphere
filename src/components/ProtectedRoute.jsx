import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default function ProtectedRoute({ children }) {
  const user = auth.currentUser;
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}