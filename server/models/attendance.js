const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    class: {
      type: String,
      required: true,
    },
    present: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ], // Array of student IDs who are present
    absent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ], // Array of student IDs who are absent
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
