const LostAndFound = require('../models/LostAndFound');

// GET all entries
exports.getLostAndFound = async (req, res) => {
  try {
    const items = await LostAndFound.find().populate('createdBy', 'username email');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error loading entries." });
  }
};

// ADD new entry
exports.addLostAndFound = async (req, res) => {
  try {
    const newItem = new LostAndFound({
      ...req.body,
      contactInfo: req.user.email,
      createdBy: req.user._id,
    });
    await newItem.save();

    // ✅ EMIT SOCKET EVENT
    req.app.get("io").emit("newLostAndFound", newItem);


    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add entry." });
  }
};

// UPDATE entry
exports.updateLostAndFound = async (req, res) => {
  try {
    const updated = await LostAndFound.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Entry not found." });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update entry." });
  }
};

// DELETE entry
exports.deleteLostAndFound = async (req, res) => {
  try {
    const deleted = await LostAndFound.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Entry not found." });

    res.json({ message: "Deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete entry." });
  }
};
