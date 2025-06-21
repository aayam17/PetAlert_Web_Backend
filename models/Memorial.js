const mongoose = require('mongoose');

const memorialSchema = new mongoose.Schema({
  petName: String,
  message: String,
  dateOfPassing: String,
  imageUrl: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Memorial', memorialSchema);
