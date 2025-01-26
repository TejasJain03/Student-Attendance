const Attendance = require("../models/attendance");

// Controller to mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { teacher, classNumber, present, absent } = req.body;
    const { date } = req.params;
    const attendance = new Attendance({
      date,
      teacher,
      class: classNumber,
      present,
      absent,
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
    const attendance = await Attendance.find({ date, class: classNumber })
      .populate("present", "fullName gender") // Populate present students with their full name and gender
      .populate("absent", "fullName gender") // Populate absent students with their full name and gender
      .populate("teacher", "name"); // Populate teacher's name

    // Check if attendance records exist
    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    // Generate attendance report
    const report = attendance.map((record) => {
      const presentCount = record.present.length;
      const absentCount = record.absent.length;
      const totalStudents = presentCount + absentCount;

      // Calculate gender counts for present students
      const presentGenderCounts = record.present.reduce(
        (acc, student) => {
          acc[student.gender.toLowerCase()] = (acc[student.gender.toLowerCase()] || 0) + 1;
          return acc;
        },
        { boy: 0, girl: 0 } // Initialize gender counts
      );

      // Calculate gender counts for absent students
      const absentGenderCounts = record.absent.reduce(
        (acc, student) => {
          acc[student.gender.toLowerCase()] = (acc[student.gender.toLowerCase()] || 0) + 1;
          return acc;
        },
        { boy: 0, girl: 0 } // Initialize gender counts
      );
      return {
        _id: record._id,
        date: record.date,
        class: record.class,
        teacher: record.teacher.name, // Teacher's name
        presentCount,
        absentCount,
        totalStudents,
        presentGenderCounts,
        absentGenderCounts,
        presentStudents: record.present,
        absentStudents: record.absent
      };
    });

    // Respond with the generated report
    res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching daily report:", error);
    res.status(500).json({ message: "An error occurred while fetching the report.", error });
  }
};

// Controller to get monthly attendance report
exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("present absent");

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
