const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment'); // Assuming you have an Appointment model

// Book an appointment
router.post('/appointment', async (req, res) => {
  const { doctorId, userId, dateTime } = req.body;
  const appointment = new Appointment({ doctorId, userId, dateTime });

  try {
    const newAppointment = await appointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
