const express = require("express");
const attendanceController = require("../controllers/attendanceControllers");
const authMiddleware = require("../middleware/authMiddleware");
const isAllowedChange = require("../middleware/isAllowedChange");

const router = express.Router();

// Route to mark attendance
router.post(
  "/mark/:date",
  authMiddleware,
  isAllowedChange,
  attendanceController.markAttendance
);

// Route to get daily attendance report
router.get("/daily-report", attendanceController.getDailyReport);

// Route to get monthly attendance report
router.get("/monthly-report", attendanceController.getMonthlyReport);

module.exports = router;
