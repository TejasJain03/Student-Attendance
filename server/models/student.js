const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    class: { type: String, required: true },                   // Column: Class
    fullName: { type: String, required: true },                 // Column: FULL NAME
    gender: { type: String, enum: ['BOY', 'GIRL'], required: true },  // Column: Gender
    yearOfAdmission: { type: String, required: true }            // Column: Year of Admission
});

module.exports = mongoose.model('Student', StudentSchema);
