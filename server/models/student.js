const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },                 
    gender: { type: String, enum: ['BOY', 'GIRL'], required: true },  
    yearOfAdmission: { type: String, required: true }            
});

module.exports = mongoose.model('Student', StudentSchema);
