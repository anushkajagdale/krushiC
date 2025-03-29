const mongoose = require('mongoose');

const GrainSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    sellerName: { type: String, required: true },
    sellerContact: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Grain', GrainSchema);
