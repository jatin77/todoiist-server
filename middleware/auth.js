const User = require("../models/User");
const asyncHandler = require("./asyncHandler");
const jwt = require("jsonwebtoken");

// Protect routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "Not authorize to acces this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || "Server error",
    });
  }
});
