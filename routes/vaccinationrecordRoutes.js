const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getVaccinationRecords,
  addVaccinationRecord,
  updateVaccinationRecord,
  deleteVaccinationRecord
} = require('../controllers/vaccinationController');

router.get('/', protect, getVaccinationRecords);
router.post('/', protect, addVaccinationRecord);
router.put('/:id', protect, updateVaccinationRecord);
router.delete('/:id', protect, deleteVaccinationRecord);

module.exports = router;
