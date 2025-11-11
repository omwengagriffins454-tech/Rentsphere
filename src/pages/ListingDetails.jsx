import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const dummyListings = [
  {
    id: "1",
    title: "Modern Apartment in Nairobi",
    price: "KSh 15,000/month",
    image: "/images/apartment1.jpg",
    location: "Nairobi, Kenya",
    description:
      "A stylish 2-bedroom apartment located in the heart of Nairobi with modern amenities, secure parking, and 24/7 water supply.",
  },
  {
    id: "2",
    title: "1 Bedroom Studio, Kisumu",
    price: "KSh 8,000/month",
    image: "/images/apartment2.jpg",
    location: "Kisumu, Kenya",
    description:
      "Affordable studio perfect for single tenants, close to public transport and shopping centers.",
  },
  {
    id: "3",
    title: "Luxury Flat in Mombasa",
    price: "KSh 25,000/month",
    image: "/images/apartment3.jpg",
    location: "Mombasa, Kenya",
    description:
      "Enjoy coastal living with this beachfront flat, fully furnished and equipped with modern fittings.",
  },
];

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = dummyListings.find((item) => item.id === id);

  if (!listing) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Listing not found!
        </Typography>
      </Container>
    );
  }

const handlePayPal = () => {
  navigate("/payment", {
    state: {
      amount: listing.price,
      method: "PayPal",
      listingTitle: listing.title,
    },
  });
};

const handleMpesa = () => {
  navigate("/payment", {
    state: {
      amount: listing.price,
      method: "M-Pesa",
      listingTitle: listing.title,
    },
  });
};

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardMedia
          component="img"
          height="250"
          image={listing.image}
          alt={listing.title}
        />
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {listing.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {listing.location}
          </Typography>
          <Typography variant="body1" mt={2}>
            {listing.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" color="primary">
            {listing.price}
          </Typography>

          {/* Payment buttons */}
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mb: 2 }}
              onClick={handlePayPal}
            >
              💳 Pay with PayPal
            </Button>
            <Button
              variant="outlined"
              color="success"
              fullWidth 
              onClick={handleMpesa}
            >
              📱 Pay with M-Pesa
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box textAlign="center" mt={3}>
        <Button onClick={() => navigate("/")}>⬅ Back to Listings</Button>
      </Box>
    </Container>
  );
};

export default ListingDetails;