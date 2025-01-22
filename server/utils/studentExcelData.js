const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Student = require("../models/student"); // Assuming your model is in the 'Student.js' file

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
    // Load the Excel file
    const workbook = xlsx.readFile("SampleTest.xlsx"); // Replace with your actual file path

    // Select the "ALL" sheet
    const sheet = workbook.Sheets["Sheet1"];

    // Convert the sheet to JSON (with headers as keys)
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Get the header row (the first row)
    const headerRow = data[0];

    // Get column indices for required columns
    const classIndex = headerRow.indexOf("Class");
    const fullNameIndex = headerRow.indexOf("FULL NAME");
    const genderIndex = headerRow.indexOf("Gender");
    const yearOfAdmissionIndex = headerRow.indexOf("Year of Admission");

    // Loop through each row (skip header row) and insert data
    const studentData = data.slice(1).map((row) => ({
      class: row[classIndex],
      fullName: row[fullNameIndex],
      gender: row[genderIndex],
      yearOfAdmission: row[yearOfAdmissionIndex],
    }));

    // Insert the data into MongoDB
    await Student.insertMany(studentData);

    console.log(`${studentData.length} records inserted successfully`);
    mongoose.disconnect();
  } catch (error) {
    console.error("Error reading Excel or inserting data", error);
    mongoose.disconnect();
  }
}
