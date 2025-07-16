const Memorial = require('../models/Memorial');

// GET
exports.getMemorials = async (req, res) => {
  try {
    const data = await Memorial.find().populate('createdBy', 'username email');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error loading memorials." });
  }
};

// POST
exports.addMemorial = async (req, res) => {
  try {
    const newEntry = new Memorial({
      petName: req.body.petName,
      message: req.body.message,
      dateOfPassing: req.body.dateOfPassing,
      imageUrl: req.body.imageUrl || "",
      createdBy: req.user._id,
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add memorial entry." });
  }
};

// PUT
exports.updateMemorial = async (req, res) => {
  try {
    const updated = await Memorial.findByIdAndUpdate(
      req.params.id,
      {
        petName: req.body.petName,
        message: req.body.message,
        dateOfPassing: req.body.dateOfPassing,
        imageUrl: req.body.imageUrl || "",
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Memorial not found." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update memorial entry." });
  }
};

// DELETE
exports.deleteMemorial = async (req, res) => {
  try {
    const deleted = await Memorial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Memorial not found." });
    res.json({ message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete memorial entry." });
  }
};
