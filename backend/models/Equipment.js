const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
    type: { type: String, required: true },
    image: { type: String, required: true },
    rent: { type: Number, required: true },
    location: { type: String, required: true },
    sellerName: { type: String, required: true },
    sellerContact: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Equipment', EquipmentSchema);
