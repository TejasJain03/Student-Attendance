const express = require("express");
const authControllers = require("../controllers/authControllers");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();

router.post("/login", catchAsync(authControllers.loginUser));
router.post("/logout", catchAsync(authControllers.logoutUser));
router.post("/register", catchAsync(authControllers.registerUser));

module.exports = router;