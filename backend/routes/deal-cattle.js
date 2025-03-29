const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const DealCattle = require('../models/DealCattle');

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

// POST route to add cattle deal details
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { cattleType, breed, age, name, contact } = req.body;
        const image = req.file ? req.file.filename : null;

        const newDealCattle = new DealCattle({
            cattleType,
            breed,
            age,
            image,
            name,
            contact,
        });

        await newDealCattle.save();
        res.status(201).json({ message: 'Cattle deal details saved successfully' });
    } catch (error) {
        console.error('Error saving cattle deal details:', error);
        res.status(500).json({ error: 'Failed to save cattle deal details' });
    }
});

module.exports = router;
