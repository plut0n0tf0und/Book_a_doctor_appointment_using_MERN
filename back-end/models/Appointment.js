const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  }
  // Add more fields as per the requirements of your app
});

module.exports = mongoose.model('Appointment', appointmentSchema);
