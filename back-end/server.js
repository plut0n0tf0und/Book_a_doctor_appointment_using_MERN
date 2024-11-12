const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api', protectedRoutes);


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Handles CORS
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Import routes
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');

// Routes setup
app.use('/api', doctorRoutes);
app.use('/api', appointmentRoutes);
app.use('/api', userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the Doctor Booking App!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
