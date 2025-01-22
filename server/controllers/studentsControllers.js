const Student = require("../models/student"); // Assuming you have a Student model

// Controller to get students by class
exports.getStudentsByClass = async (req, res) => {
  try {
    // Get the class from the request parameters
    const { studentClass } = req.params;

    // Find all students with the given class
    const students = await Student.find({ class: studentClass });

    // If no students are found
    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: `No students found for class: ${studentClass}` });
    }

    // Send the students as a JSON response
    res.status(200).json(students);
  } catch (error) {
    // If there's an error, send a 500 response
    console.error(error); // For debugging
    res
      .status(500)
      .json({ message: "Error fetching students", error: error.message });
  }
};
