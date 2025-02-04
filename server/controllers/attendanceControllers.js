const Attendance = require("../models/attendance");
const Student = require("../models/student");
const AcademicRecord = require("../models/academicRecord");

// Controller to mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { teacher, classNumber, present, absent } = req.body;
    const { date } = req.params;

    // Get the academic records for the given class
    const academicRecords = await AcademicRecord.find({ currentClass: classNumber }).populate("student");

    if (!academicRecords.length) {
      return res.status(404).json({ message: "No students found for this class." });
    }

    // Ensure that all students are linked through AcademicRecord
    const presentStudents = academicRecords
      .filter((record) => present.includes(record.student._id.toString()))
      .map((record) => record.student._id);

    const absentStudents = academicRecords
      .filter((record) => absent.includes(record.student._id.toString()))
      .map((record) => record.student._id);

    // Check if attendance already exists for this teacher, class, and date
    const existingAttendance = await Attendance.findOne({ date, teacher, class: classNumber });

    if (existingAttendance) {
      return res.status(400).json({ message: "Attendance for this teacher, class, and date already exists." });
    }

    const attendance = new Attendance({
      date,
      teacher,
      class: classNumber,
      present: presentStudents,
      absent: absentStudents,
    });

    await attendance.save();
    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to get daily attendance report
exports.getDailyReport = async (req, res) => {
  try {
    const { date, classNumber } = req.params;

    // Fetch attendance records for the given date and class
    const attendanceRecords = await Attendance.find({ date, class: classNumber })
      .populate({
        path: "present",
        select: "fullName gender",
      })
      .populate({
        path: "absent",
        select: "fullName gender",
      })
      .populate("teacher", "name");

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    // Generate report
    const report = attendanceRecords.map((record) => {
      const presentCount = record.present.length;
      const absentCount = record.absent.length;
      const totalStudents = presentCount + absentCount;

      // Count gender distribution for present & absent students
      const genderCount = (students) =>
        students.reduce(
          (acc, student) => {
            acc[student.gender.toLowerCase()] = (acc[student.gender.toLowerCase()] || 0) + 1;
            return acc;
          },
          { boy: 0, girl: 0 }
        );

      return {
        _id: record._id,
        date: record.date,
        class: record.class,
        teacher: record.teacher.name,
        presentCount,
        absentCount,
        totalStudents,
        presentGenderCounts: genderCount(record.present),
        absentGenderCounts: genderCount(record.absent),
        presentStudents: record.present,
        absentStudents: record.absent,
      };
    });

    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching daily report:", error);
    res.status(500).json({ message: "An error occurred while fetching the report.", error });
  }
};

// Controller to get monthly attendance report
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year, classNumber } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
      class: classNumber,
    })
      .populate("present", "fullName gender")
      .populate("absent", "fullName gender")
      .populate("teacher", "name");

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found for this month and class." });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
