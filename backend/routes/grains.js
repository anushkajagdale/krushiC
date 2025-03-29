const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Grain = require('../models/Grain');

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

// POST route to add grain details
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, quantity, price, location, sellerName, sellerContact } = req.body;
        const image = req.file ? req.file.filename : null;

        const newGrain = new Grain({
            name,
            image,
            quantity,
            price,
            location,
            sellerName,
            sellerContact,
        });

        await newGrain.save();
        res.status(201).json({ message: 'Grain details saved successfully' });
    } catch (error) {
        console.error('Error saving grain details:', error);
        res.status(500).json({ error: 'Failed to save grain details' });
    }
});

// GET route to fetch all grains
router.get('/', async (req, res) => {
    try {
        const grains = await Grain.find();
        res.status(200).json(grains);
    } catch (error) {
        console.error('Error fetching grains:', error);
        res.status(500).json({ error: 'Failed to fetch grains' });
    }
});

module.exports = router;
