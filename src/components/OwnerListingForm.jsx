import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function OwnerListingForm() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "listings"), {
        ...form,
        ownerId: auth.currentUser?.uid,
        createdAt: new Date(),
        booked: false
      });
      alert("Listing added successfully!");
      setForm({ title: "", location: "", price: "", description: "" });
    } catch (err) {
      alert("Error adding listing: " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "300px",
        margin: "20px auto"
      }}
    >
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price (Ksh)" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <button type="submit" style={{ background: "#007bff", color: "white", padding: "8px", borderRadius: "5px" }}>
        Add Listing
      </button>
    </form>
  );
}
