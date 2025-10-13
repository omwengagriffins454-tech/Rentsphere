import React, { useState } from "react"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import PaymentGateway from "./PaymentGateway";

const ListinngCard = ({ listing }) => {
  const [booked, setBooked] = useState(listing.booked);
const [ showPayment, setShowPayment ] = useState(false);

const handlePaymentSuccess = async (method) => {
  await updateDoc(doc(db, "listings",listing.id), { booked: true });
  setBooked(true);
  alert('&#9989;Booked successfuly via ${method}');
} ;

return(
  <div className="booder p-4 rounded-lg shadow-sm bg-white">
  <h3 className="text-lg font-semibold">{listing.title}</h3>
  <p>&#128176;Ksh {listing.price}</p>
  <p>&#128205;{listing.location}</p>

  {booked ? (
    <span className="text-green-600 font-bold">&#10004;Booked </span>
  ) : showPayment ? (
    <paymentGateway amount={50} onPaymentSuccess={handlePaymentSuccess} />
  ) : (
    <button
      onClick={() => setShowPayment(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Book Now (Ksh 50)
      </button>
  )}  
  </div>
);
};

export default ListingCard;