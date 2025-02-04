const Student = require("../models/student");
const AcademicRecord = require("../models/academicRecord");

// Controller to get students by class
exports.getStudentsByClass = async (req, res) => {
  try {
    const { classNumber } = req.params;

    // Find academic records for the given class and populate the student details
    const academicRecords = await AcademicRecord.find({ currentClass: classNumber }).populate("student");

    // Extract student details
    const students = academicRecords.map((record) => record.student);

    if (students.length === 0) {
      return res.status(404).json({ message: `No students found for class: ${classNumber}` });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};
