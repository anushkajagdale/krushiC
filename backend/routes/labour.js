const express = require('express');
const router = express.Router();
const Labour = require('../models/Labour');

// POST route to register a labourer
router.post('/register', async (req, res) => {
    try {
        const { name, location, phone, rent_per_day, gender } = req.body;

        if (!name || !location || !phone || !rent_per_day || !gender) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newLabour = new Labour({
            name,
            location,
            phone,
            rent_per_day,
            gender,
        });

        await newLabour.save();
        res.status(201).json({ message: 'Labour registered successfully', labour: newLabour });
    } catch (error) {
        console.error('Error registering labour:', error);
        res.status(500).json({ error: 'Failed to register labour' });
    }
});

// GET route to fetch all registered labourers
router.get('/', async (req, res) => {
    try {
        const labourers = await Labour.find();
        res.status(200).json(labourers);
    } catch (error) {
        console.error('Error fetching labourers:', error);
        res.status(500).json({ error: 'Failed to fetch labourers' });
    }
});

module.exports = router;
