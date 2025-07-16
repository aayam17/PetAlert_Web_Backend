const mongoose = require('mongoose');

const vetAppointmentSchema = new mongoose.Schema({
  date: String,
  time: String,
  petName: String,
  vetName: String,
  location: String,
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Canceled'],
    default: 'Scheduled'
  },
  reason: String,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('VetAppointment', vetAppointmentSchema);
