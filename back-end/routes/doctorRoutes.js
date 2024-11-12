const express = require('express');
const router = express.Router();
const doctor = require("C:/Users/Administrator/OneDrive/Documents/NM Porject Nov'24/back-end/Models/Doctor.js"); // Assuming you have a Doctor model set up
const Doctor = require('C:/Users/Administrator/OneDrive/Documents/NM Porject Nov\'24/back-end/Models/Doctor.js');

// Get all doctor
router.get("C:/Users/Administrator/OneDrive/Documents/NM Porject Nov'24/back-end/Models/Doctor.js", async (req, res) => {
  try {
    const doctor = await Doctor.find();s
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new doctor
router.post("C:/Users/Administrator/OneDrive/Documents/NM Porject Nov'24/back-end/Models/Doctor.js", async (req, res) => {
  const { name, specialty, availableSlots } = req.body;
  const doctor = new Doctor({ name, specialty, availableSlots });

  try {
    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
