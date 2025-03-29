const mongoose = require('mongoose');

const LabourSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    rent_per_day: { type: Number, required: true },
    gender: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Labour', LabourSchema);
