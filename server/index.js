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
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo succesfully");
  } catch (err) {
    console.log("Error while connecting to database");
  }
};
connectDB();

const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: "https://student-attendance-client.vercel.app/",
  // origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/students", studentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json("School Attendance Management");
});

app.all("*", (req, res, next) => {
  try {
    new ExpressError(404, false, "Page not found");
  } catch (error) {
    next(error);
  }
});

app.use(GlobalErrorHandler);

app.listen(PORT, () => {
  console.log("LISTENING TO THE PORT");
});
