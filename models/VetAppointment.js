const mongoose = require('mongoose');

const vetAppointmentSchema = new mongoose.Schema({
  date: String,
  time: String,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  }
}, { timestamps: true }); 

module.exports = mongoose.model('VetAppointment', vetAppointmentSchema);
