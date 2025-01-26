const User = require("../models/users");

// Get all users
exports.getAllTeachers = async (req, res) => {
  const users = await User.find({ role: 'teacher' });
  res.status(200).json(users);
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
};

// Create a new user
exports.createUser = async (req, res) => {
  const user = new User(req.body);
  const newUser = await user.save();
  res.status(201).json(newUser);
};

// Update an existing user
exports.updateUser = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedUser)
    return res.status(404).json({ message: "User not found" });
  res.status(200).json(updatedUser);
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ message: "User deleted" });
};

exports.adminAllowChanges = async (req, res) => {
  const { allowChanges } = req.body;
  const { teacherId } = req.params;
  const result = await User.updateOne(
    { _id: teacherId, role: "teacher" },
    { $set: { isAllowedChanges: allowChanges } }
  );
  if (result.nModified === 0) {
    return res.status(404).json({ message: "Teacher not found or no changes made" });
  }
  res.status(200).json({ message: "Teacher updated successfully." });
};

exports.isAllowedChange = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user.isAllowedChanges) {
    return res.status(200).json({ allowed: false, message: "You do not have permission to give attendance." });
  }
  res.status(200).json({ allowed: true, message: "You have permission to give attendance." });
};
