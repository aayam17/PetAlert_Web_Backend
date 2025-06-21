const Vaccination = require('../models/VaccinationRecord');

exports.getVaccinationRecords = async (req, res) => {
  try {
    const records = await Vaccination.find().populate('createdBy', 'username email');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error loading records." });
  }
};

exports.addVaccinationRecord = async (req, res) => {
  try {
    const record = new Vaccination({
      ...req.body,
      createdBy: req.user._id,
    });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: "Failed to add record." });
  }
};

exports.updateVaccinationRecord = async (req, res) => {
  try {
    const updated = await Vaccination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Record not found." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update record." });
  }
};

exports.deleteVaccinationRecord = async (req, res) => {
  try {
    const deleted = await Vaccination.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found." });
    res.json({ message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete record." });
  }
};
