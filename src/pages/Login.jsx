import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === "owner") navigate("/owner-dashboard");
        else navigate("/tenant-dashboard");
      } else {
        setError("No user data found!");
      }
    } catch (err) {
      setError("Invalid login credentials.");
    }
  };

  return (
    <div className="login-container">
      <h2>🔐 Login to Rentsphere</h2>
      <form onSubmit={handleLogin}>
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

        {error && <p className="error">{error}</p>}

        <button type="submit">Login</button>
      </form>

      <p>
        Forgot password? <a href="/reset-password">Reset</a>
      </p>
    </div>
  );
};

export default Login;