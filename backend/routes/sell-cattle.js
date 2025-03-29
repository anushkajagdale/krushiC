const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const SellCattle = require('../models/SellCattle');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// POST route to add seller cattle details
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { cattleType, breed, age, name, contact } = req.body;
        const image = req.file ? req.file.filename : null;

        const newSellCattle = new SellCattle({
            cattleType,
            breed,
            age,
            image,
            name,
            contact,
        });

        await newSellCattle.save();
        res.status(201).json({ message: 'Cattle details saved successfully' });
    } catch (error) {
        console.error('Error saving cattle details:', error);
        res.status(500).json({ error: 'Failed to save cattle details' });
    }
});

module.exports = router;
