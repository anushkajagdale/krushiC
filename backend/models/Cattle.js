const mongoose = require('mongoose');

const CattleSchema = new mongoose.Schema({
    cattleType: { type: String, required: true },
    breed: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Cattle', CattleSchema);
