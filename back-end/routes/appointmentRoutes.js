import express from 'express';
import Appointment from '../models/appointmentModel.js';

const router = express.Router();

// Create an appointment route
router.post('/create', async (req, res) => {
  try {
    const { userId, doctorId, date } = req.body;
    const newAppointment = new Appointment({ userId, doctorId, date });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get appointments by user
router.get('/user/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
