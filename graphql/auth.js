const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const auth = async (token) => {
  if (!token) throw new Error("No token provided");

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // Find the user by the decoded userId
    const user = await User.findById(decoded.userId);
    if (!user) throw new Error("User not found");
    return user; // Return the user object
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { signToken, auth };
