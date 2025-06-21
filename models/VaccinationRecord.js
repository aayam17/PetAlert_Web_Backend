const mongoose = require('mongoose');

const vaccinationRecordSchema = new mongoose.Schema({
  vaccine: String,
  notes: String,
  date: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('VaccinationRecord', vaccinationRecordSchema);
