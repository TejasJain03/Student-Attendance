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
  try {
    const { date } = req.query;

    const attendance = await Attendance.find({ date }).populate(
      "present absent"
    );

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
