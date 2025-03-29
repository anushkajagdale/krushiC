const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Cattle = require('../models/Cattle');

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

// POST route to add cattle details
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { cattleType, breed, price, name, contact, address } = req.body;
        const image = req.file ? req.file.filename : null;

        const newCattle = new Cattle({
            cattleType,
            breed,
            image,
            price,
            name,
            contact,
            address,
        });

        await newCattle.save();
        res.status(201).json({ message: 'Cattle details saved successfully' });
    } catch (error) {
        console.error('Error saving cattle details:', error);
        res.status(500).json({ error: 'Failed to save cattle details' });
    }
});

module.exports = router;
