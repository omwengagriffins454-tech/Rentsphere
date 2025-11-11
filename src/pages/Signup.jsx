import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("tenant"); // default role
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // 1️⃣ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2️⃣ Save role and profile data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        role,
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Redirect based on role
      if (role === "owner") navigate("/owner-dashboard");
      else navigate("/tenant-dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>📝 Create Your Rentsphere Account</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="tenant">Tenant</option>
          <option value="owner">Apartment Owner</option>
        </select>

        {error && <p className="error">{error}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;