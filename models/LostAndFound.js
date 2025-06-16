const mongoose = require('mongoose');

const lostAndFoundSchema = new mongoose.Schema({
  type: { type: String, enum: ['Lost', 'Found'], required: true },
  description: String,
  location: String,
  date: String,
  time: String,
  contactInfo: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LostAndFound', lostAndFoundSchema);
