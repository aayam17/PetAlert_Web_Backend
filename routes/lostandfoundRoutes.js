const express = require('express');
const router = express.Router();
const LostAndFound = require('../models/LostAndFound');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const items = await LostAndFound.find().populate('createdBy', 'username email');
  res.json(items);
});

router.post('/', protect, async (req, res) => {
  const item = new LostAndFound({
    ...req.body,
    contactInfo: req.user.email,
    createdBy: req.user.id
  });
  await item.save();
  res.status(201).json(item);
});

module.exports = router;
