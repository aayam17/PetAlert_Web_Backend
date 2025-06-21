const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password"); 
    if (!req.user) return res.status(404).json({ message: "User not found" });
    next();
  } catch (err) {
    console.error("Token error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { protect };
