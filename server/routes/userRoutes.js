const express = require("express");
const userControllers = require("../controllers/userControllers");
const isAdmin = require("../middleware/isAdmin");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to add a new user
router.post("/add", authMiddleware, isAdmin, userControllers.createUser);
router.get(
  "/getallusers",
  authMiddleware,
  isAdmin,
  userControllers.getAllUsers
);

module.exports = router;
// Route to get all users
