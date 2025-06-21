const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getLostAndFound,
  addLostAndFound,
  updateLostAndFound,
  deleteLostAndFound
} = require('../controllers/lostAndFoundController');

router.get('/', protect, getLostAndFound);
router.post('/', protect, addLostAndFound);
router.put('/:id', protect, updateLostAndFound);
router.delete('/:id', protect, deleteLostAndFound);

module.exports = router;
