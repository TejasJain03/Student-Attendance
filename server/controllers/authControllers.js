const bcrypt = require("bcryptjs");
const User = require("../models/users");
const generateToken = require("../utils/generateToken");

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(res, user);
    res.status(200).json({ message: "Login successful", user: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Logout a user
exports.logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ message: "User not found" });

    user.isLoggedIn = false;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUser = async (req, res) => {
  const user = req.user
  res.json({ user })
}