import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography } from "@mui/material";

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); // Show for 2.5 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background:
            "linear-gradient(135deg, #007bff, #00c6ff, #007bff)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          zIndex: 9999,
        }}
      >
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ letterSpacing: "1px" }}
          >
            🏠 Rentsphere
          </Typography>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Typography
            variant="subtitle1"
            sx={{ mt: 2, opacity: 0.9, fontWeight: 500 }}
          >
            Find your next home with ease
          </Typography>
        </motion.div>
      </Box>
    </AnimatePresence>
  );
};

export default SplashScreen;