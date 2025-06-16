const express = require('express');
const router = express.Router();
const Memorial = require('../models/Memorial');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
  const memorials = await Memorial.find().populate('createdBy', 'username email');
  res.json(memorials);
});

router.post('/', protect, async (req, res) => {
  const memorial = new Memorial({
    ...req.body,
    createdBy: req.user.id
  });
  await memorial.save();
  res.status(201).json(memorial);
});

module.exports = router;
