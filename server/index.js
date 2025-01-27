const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const ExpressError = require("./utils/ExpressError");
const GlobalErrorHandler = require("./utils/GlobalErrorHandler");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const studentRoutes = require("./routes/studentsRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

// Middleware for Permissions-Policy header
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "fullscreen=(self), geolocation=(self)" // Add supported features here
  );
  next();
});

// Database connection
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo successfully");
  } catch (err) {
    console.log("Error while connecting to database");
  }
};
connectDB();

const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: "https://student-attendance-client.vercel.app",
  // origin: "http://localhost:5173", // Uncomment for local development
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.json("School Attendance Management");
});

// Handle undefined routes
app.all("*", (req, res, next) => {
  try {
    new ExpressError(404, false, "Page not found");
  } catch (error) {
    next(error);
  }
});

// Global error handler
app.use(GlobalErrorHandler);

// Start server
app.listen(PORT, () => {
  console.log("LISTENING TO THE PORT");
});
