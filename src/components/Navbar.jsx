import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const auth = getAuth();

  // ✅ Listen for login/logout changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // ✅ Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          🏠 Rentsphere
        </Link>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/">🏡 Home</Link>
        <Link to="/pricing">💰 Pricing</Link>
        <Link to="/contact">📞 Contact</Link>
        <Link to="/dashboard/payments">💳 Payments</Link>

        {/* ✅ Show login/signup only if user not logged in */}
        {!user && (
          <>
            <Link to="/login">🔐 Login</Link>
            <Link to="/signup">📝 Signup</Link>
          </>
        )}

        {/* ✅ Show profile menu if user is logged in */}
        {user && (
          <div
            className="user-profile"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={
                user.photoURL ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="User"
              className="user-avatar"
            />
            <span className="username">
              {user.displayName || user.email?.split("@")[0]}
            </span>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/dashboard">🏠 My Dashboard</Link>
                <Link to="/profile">👤 My Account</Link>
                <button onClick={handleLogout}>🚪 Logout</button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;