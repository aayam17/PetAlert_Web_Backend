const Memorial = require('../models/Memorial');

exports.getMemorials = async (req, res) => {
  try {
    const data = await Memorial.find().populate('createdBy', 'username email');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error loading memorials." });
  }
};

exports.addMemorial = async (req, res) => {
  try {
    const newEntry = new Memorial({
      ...req.body,
      createdBy: req.user._id,
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: "Failed to add memorial entry." });
  }
};

exports.updateMemorial = async (req, res) => {
  try {
    const updated = await Memorial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Memorial not found." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update memorial entry." });
  }
};

exports.deleteMemorial = async (req, res) => {
  try {
    const deleted = await Memorial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Memorial not found." });
    res.json({ message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete memorial entry." });
  }
};
