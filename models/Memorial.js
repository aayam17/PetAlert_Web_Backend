const mongoose = require('mongoose');

const memorialSchema = new mongoose.Schema({
  petName: String,
  message: String,
  dateOfPassing: String,
  imageUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Memorial', memorialSchema);
