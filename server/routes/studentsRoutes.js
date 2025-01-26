const express = require("express");
const studentsController = require("../controllers/studentsControllers");

const router = express.Router();

// Route to get students class-wise
router.get("/:classNumber", studentsController.getStudentsByClass);

module.exports = router;
