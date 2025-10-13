import React, {useEffect, useState} from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import ListingCard from '../components/ListingCard';

const available = snapshot.docs
  .map(doc => ({ id: doc.id, ...doc.data() }))
  .filter(item => !item.booked); setListings(available);

const Listings = () => {
  const [listings, setListings] =useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const snapshot = await getDocs(collection(db, "listings"));
      setListings(snapshot.docs.map((docs) => ({ id: docs.id, ...doc.data() })));
    };
    fetchListings();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <hi className="text-3xl font-bond mb-4 text-blue-700">Available Listings</hi>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {listings.map((listings) => (
        <div 
          key={listings.id}
          className="border rounded-gl p-4 bg-white shadow-sm hover:shadow-md">
            <h3 className="text-xl font-semibold">{listings.title}</h3>
            <p>&#128176; Ksh {listings.price}</p>
            <p>&#128205; {listings.location}</p>
            {listings.lat && listing.lng && (
              <p className="text-sm text-gray-600">
                coordinates: {listing.lat.toFixed(4)}, {listing.lng.Fixed(4)}
              </p>
            )}
            </div>
      ))}
      </div>
    </div>
  );
};

export default Listings;