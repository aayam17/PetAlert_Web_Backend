const User = require("../models/User");

const updateUser = async (req, res) => {
  try {
    const { username } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updates = {};
    if (username) updates.username = username;
    if (avatar) updates.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { updateUser };
