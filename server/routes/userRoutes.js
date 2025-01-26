const express = require("express");
const userControllers = require("../controllers/userControllers");
const isAdmin = require("../middleware/isAdmin");
const authMiddleware = require("../middleware/authMiddleware");
const catchAsync = require("../utils/catchAsync");
const isAllowedChange = require("../middleware/isAllowedChange");

const router = express.Router();

// Route to add a new user
router.post("/add", authMiddleware, isAdmin, catchAsync(userControllers.createUser));
router.get(
  "/getallteachers",
  authMiddleware,
  isAdmin,
  catchAsync(userControllers.getAllTeachers)
);

// Route for admin to change a field
router.put(
  "/admin/changefield/:teacherId",
  authMiddleware,
  isAdmin,
  catchAsync(userControllers.adminAllowChanges)
);

router.get('/isallowed', authMiddleware, catchAsync(userControllers.isAllowedChange));

module.exports = router;
