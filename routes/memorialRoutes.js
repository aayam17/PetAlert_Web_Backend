const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getMemorials,
  addMemorial,
  updateMemorial,
  deleteMemorial
} = require('../controllers/memorialController');

router.get('/', protect, getMemorials);
router.post('/', protect, addMemorial);
router.put('/:id', protect, updateMemorial);
router.delete('/:id', protect, deleteMemorial);

module.exports = router;
