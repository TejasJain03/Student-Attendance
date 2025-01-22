const Attendance = require("../models/attendance");

// Controller to mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { teacher, className, present, absent } = req.body;
    const { date } = req.params;
    const attendance = new Attendance({
      date,
      teacher,
      class: className,
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
  const { date,  className } = req.params;

  const attendance = await Attendance.find({ date, class: className }).populate(
    "present absent teacher"
  );

  // Initialize the report summary
  const report = attendance.map((record) => {
    const presentCount = record.present.length;
    const absentCount = record.absent.length;
    const totalStudents = presentCount + absentCount;

    const presentGenderCounts = record.present.reduce(
      (acc, student) => {
        acc[student.gender.toLowerCase()]++;
        return acc;
      },
      { boy: 0, girl: 0 }
    );

    const absentGenderCounts = record.absent.reduce(
      (acc, student) => {
        acc[student.gender.toLowerCase()]++;
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
      presentGenderCounts,
      absentGenderCounts,
    };
  });

  res.status(200).json(report);
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
