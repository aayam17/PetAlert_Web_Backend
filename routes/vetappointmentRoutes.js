const express = require('express');
const router = express.Router();

const {
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

const { protect } = require('../middleware/authMiddleware');

router.get('/', getAppointments);
router.post('/', protect, addAppointment); 
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
