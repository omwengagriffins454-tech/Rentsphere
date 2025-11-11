import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // You can pass payment data using navigate('/payment', { state: { amount, method, listingTitle } })
  const { amount, method, listingTitle } = location.state || {
    amount: "KSh 0",
    method: "Unknown",
    listingTitle: "Unknown Listing",
  };

  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");

  const handleConfirmPayment = () => {
    setProcessing(true);
    setStatus("");
    // Simulate payment delay
    setTimeout(() => {
      setProcessing(false);
      setStatus("success");
    }, 2000);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Payment Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1">
            <strong>Listing:</strong> {listingTitle}
          </Typography>
          <Typography variant="body1">
            <strong>Amount:</strong> {amount}
          </Typography>
          <Typography variant="body1">
            <strong>Method:</strong> {method}
          </Typography>

          <Box textAlign="center" mt={3}>
            {!processing && !status && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleConfirmPayment}
              >
                Confirm Payment
              </Button>
            )}

            {processing && (
              <Box>
                <CircularProgress />
                <Typography mt={2}>Processing payment…</Typography>
              </Box>
            )}

            {status === "success" && (
              <Box>
                <Typography color="green" fontWeight="bold" mt={2}>
                  ✅ Payment Successful!
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 3 }}
                  onClick={() => navigate("/")}
                >
                  Return Home
                </Button>
              </Box>
            )}

            {status === "failed" && (
              <Box>
                <Typography color="error" fontWeight="bold" mt={2}>
                  ❌ Payment Failed. Try again!
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 3 }}
                  onClick={() => navigate("/")}
                >
                  Return Home
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Payment;