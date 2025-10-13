import React from "react";
import { link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-brand">
                <span className="logo">&#127968;</span>
                <h1>Rentsphere</h1>
            </div>

            <nav className="navbar-links">
                <Link to="/">&#127969;Home</Link>
                <Link to="/pricing">&#128176;Pricing</Link>
                <Link to="/payment">&#128179;Payment</Link>
                <Link to="/login">&#128272;Login</Link>
                <Link to="/signup">&#128221;Signup</Link>
                <Link to="/owner-dashboard">Dashboard</Link>
            </nav>
        </header>
    );
}