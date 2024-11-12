const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  availableSlots: [String], // or however you defined it
});

module.exports = mongoose.model('Doctor', doctorSchema);
