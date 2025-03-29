const mongoose = require('mongoose');

const SellCattleSchema = new mongoose.Schema({
    cattleType: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SellCattle', SellCattleSchema);
