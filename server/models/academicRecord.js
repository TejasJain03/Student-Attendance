const mongoose = require('mongoose');

const AcademicRecordSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    academicYear: { type: String, required: true },  // Example: "2024-2025"
    currentClass: { type: String, required: true },
    promoted: { type: Boolean, default: false }
});

module.exports = mongoose.model('AcademicRecord', AcademicRecordSchema);
