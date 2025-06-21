const Appointment = require('../models/VetAppointment');

exports.getAppointments = async (req, res) => {
  try {
    const data = await Appointment.find().populate('createdBy', 'username email');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error loading appointments." });
  }
};


exports.addAppointment = async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      createdBy: req.user._id, 
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    console.error("Failed to add appointment:", err.message);
    res.status(500).json({ message: "Failed to add appointment." });
  }
};


exports.updateAppointment = async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Appointment not found." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update appointment." });
  }
};


exports.deleteAppointment = async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Appointment not found." });
    res.json({ message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete appointment." });
  }
};
