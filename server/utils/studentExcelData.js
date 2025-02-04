const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Student = require("../models/student");
const AcademicRecord = require("../models/academicRecord");

const MONGO_URI =
  "mongodb+srv://TejasJain03:vownP7Xp7j2NLO9C@cluster0.0ldxy2n.mongodb.net/student-attendence?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    readExcelAndInsertData();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Function to read Excel file and insert data into MongoDB
async function readExcelAndInsertData() {
  try {
    const workbook = xlsx.readFile("SampleTest.xlsx"); // Replace with actual file path
    const sheet = workbook.Sheets["Sheet1"];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Get header row
    const headerRow = data[0];

    // Get column indices
    const fullNameIndex = headerRow.indexOf("FULL NAME");
    const genderIndex = headerRow.indexOf("Gender");
    const yearOfAdmissionIndex = headerRow.indexOf("Year of Admission");
    const classIndex = headerRow.indexOf("Class");

    // Process each row (excluding header)
    for (const row of data.slice(1)) {
      const fullName = row[fullNameIndex];
      const gender = row[genderIndex];
      const yearOfAdmission = row[yearOfAdmissionIndex];
      const studentClass = row[classIndex];

      if (!fullName || !gender || !yearOfAdmission || !studentClass) continue; // Skip invalid rows

      // **Check if student exists** (by name & yearOfAdmission)
      let student = await Student.findOne({ fullName, yearOfAdmission });

      if (!student) {
        student = await Student.create({
          fullName,
          gender,
          yearOfAdmission,
        });
      }

      // **Check if AcademicRecord exists for this student & class**
      const existingRecord = await AcademicRecord.findOne({
        student: student._id,
        academicYear: "2024-2025",
        currentClass: studentClass,
      });

      if (!existingRecord) {
        await AcademicRecord.create({
          student: student._id,
          academicYear: "2024-2025",
          currentClass: studentClass,
          promoted: false,
        });
      }
    }

    console.log("Data import completed successfully");
    mongoose.disconnect();
  } catch (error) {
    console.error("Error reading Excel or inserting data", error);
    mongoose.disconnect();
  }
}
