import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Chip,
} from "@mui/material";

export default function PaymentsDashboard() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "payments"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPayments(data);
    });
    return unsubscribe;
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div style={{ padding: "30px", backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      <Card sx={{ maxWidth: "900px", margin: "0 auto", boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            💳 Payments Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            View all tenant payments (PayPal and M-Pesa)
          </Typography>

          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>User</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Listing ID</strong></TableCell>
                  <TableCell><strong>Method</strong></TableCell>
                  <TableCell><strong>Amount (Ksh)</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.userName}</TableCell>
                    <TableCell>{p.userEmail}</TableCell>
                    <TableCell>{p.listingId}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.method}
                        color={p.method === "PayPal" ? "primary" : "success"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{p.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.status}
                        color={
                          p.status === "Success"
                            ? "success"
                            : p.status === "Initiated"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(p.timestamp)}</TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No payments recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}