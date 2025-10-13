import React, { useState } from "react";
import LocationPicker from "../components/LocationPicker";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const AddListing = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [coordinates, setCoordinates] = useState(null);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!coordinates) {
        alert("Please selected a location on the map.");
        return;
      }

      await addDoc(collection(db, "listings"),
  {
      title,
      price: Number(price),
      location,
      lat: coordinates.lat,
      lng: coordinates.lng,
      booked: false,
    });

    alert("&#9989;Listing added successfully!");
    setTitle("");
    setPrice("");
    SetLocation("");
    setCoordinates(null); 
    };

    return (
      <div className="max-w-md mx-auto p-4 space-y-4 bg-white shadow rounded-xl">
        <h2 className="text-xl font-semibold text-center">&#127968;Add New Listing</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Apartment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price (ksh)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border rounded"
            />
           <input
              type="text"
              placholder="Location Name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <LocationPicker onLocationSelect={setCoordinates} />
            <button
              type="submit"
              className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
            >
              Save Listings
            </button>
          </form>
        </div>
      );
    };

  export default AddListing;