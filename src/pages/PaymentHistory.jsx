import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { CSVLink } from "react-csv";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [filterMethod, setFilterMethod] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      let q = query(collection(db, "payments"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPayments(data);
    };
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const matchMethod = filterMethod === "All" || p.method === filterMethod;
    const matchDate = !filterDate || (p.timestamp?.toDate().toISOString().slice(0,10) === filterDate);
    return matchMethod && matchDate;
  });

  return (
    <div className="payment-history">
      <h2>💳 Payment History</h2>

      <div className="filters">
        <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
          <option value="All">All Methods</option>
          <option value="PayPal">PayPal</option>
          <option value="M-Pesa">M-Pesa</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <CSVLink
        filename="rentsphere_payments.csv"
        data={filtered.map((p) => ({
          Amount: p.amount,
          Method: p.method,
          Role: p.role,
          Status: p.status,
          Date: p.timestamp?.toDate().toLocaleString(),
        }))}
      >
        📤 Export CSV
      </CSVLink>

      <ul>
        {filtered.map((p) => (
          <li key={p.id}>
            <strong>{p.role}</strong> - {p.method} - Ksh.{p.amount} -{" "}
            {p.timestamp?.toDate().toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentHistory;