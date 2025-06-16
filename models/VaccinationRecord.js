const mongoose = require('mongoose');

const vaccinationRecordSchema = new mongoose.Schema({
  vaccine: String,
  notes: String,
  date: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VaccinationRecord', vaccinationRecordSchema);
