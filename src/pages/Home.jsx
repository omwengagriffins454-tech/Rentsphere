import React from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const listings = [
  {
    id: 1,
    title: "Modern Apartment in Nairobi",
    price: "KSh 15,000/month",
    image: "/images/apartment1.jpg",
    location: "Nairobi, Kenya",
  },
  {
    id: 2,
    title: "1 Bedroom Studio, Kisumu",
    price: "KSh 8,000/month",
    image: "/images/apartment2.jpg",
    location: "Kisumu, Kenya",
  },
  {
    id: 3,
    title: "Luxury Flat in Mombasa",
    price: "KSh 25,000/month",
    image: "/images/apartment3.jpg",
    location: "Mombasa, Kenya",
  },
];

const Home = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        color="primary"
      >
        <motion.img
  src="/logo.png"
  alt="Rentsphere Logo"
  style={{ width: "90px", height: "90px", marginBottom: "16px" }}
  initial={{ scale: 0.7, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
/>
      </Typography>
      <Typography textAlign="center" color="text.secondary" mb={3}>
        Find your perfect rental home easily
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search by location or type..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4, borderRadius: 2 }}
      />

      {/* Featured Listings */}
      <Typography variant="h6" mb={2}>
        Featured Listings
      </Typography>
      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} key={listing.id}>
            <Card
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                "&:hover": { transform: "scale(1.02)" },
                transition: "0.3s",
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={listing.image}
                alt={listing.title}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {listing.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {listing.location}
                </Typography>
                <Typography variant="subtitle1" color="primary" mt={1}>
                  {listing.price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  href={'/listing/${listing.id'}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer */}
      <Box textAlign="center" mt={6} color="text.secondary">
        <Typography variant="body2">© {new Date().getFullYear()} Rentsphere</Typography>
      </Box>
    </Container>
  );
};

export default Home;