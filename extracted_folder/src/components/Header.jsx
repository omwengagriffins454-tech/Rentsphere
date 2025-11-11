import React from 'react'
import { Link } from 'react-router-dom'

export default function Header(){
  return (
    <header className="container header" style={{paddingTop:18,paddingBottom:18}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div className="logo"><img src="/logo.svg" alt="Rentsphere logo"/></div>
        <div style={{fontWeight:700,color:'var(--accent)'}}>Rentsphere</div>
      </div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/listings">Listings</Link>
        <Link to="/features">Features</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/dashboard" className="cta" style={{marginLeft:12}}>Dashboard</Link>
        <Link to="/login" style={{marginLeft:10}}>Login</Link>
      </nav>
    </header>
  )
}