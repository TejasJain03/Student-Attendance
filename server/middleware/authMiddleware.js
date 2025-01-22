const jwt = require("jsonwebtoken");
const ExpressError = require("../utils/ExpressError").default;
require("dotenv").config();
const User = require("../models/users");

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      success: false,
      status: "logout",
      message: "Session Expired! Please Login Again!",
    });
  }
  const data = jwt.verify(token, process.env.JWT_SECRET);
  if (!data) {
    res.clearCookie("access_token", { httpOnly: true, expires: new Date(0) });
    res.status(401).send("Session Expired. Login Again!");
  }
  req.user = data.user;
  if (!req.user) throw new ExpressError(400, false, "User was not found");

  next();
};

module.exports = isLoggedIn;
