const mongoose = require('mongoose');

const vetAppointmentSchema = new mongoose.Schema({
  date: String,
  time: String,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VetAppointment', vetAppointmentSchema);
