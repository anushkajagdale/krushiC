const express = require('express');
const router = express.Router();
const Labour = require('../models/Labour');
const mongoose = require('mongoose');

// POST route to register a labourer
router.post('/register', async (req, res) => {
    try {
        const { name, location, phone, rent_per_day, gender } = req.body;

        // Validate required fields
        if (!name || !location || !phone || !rent_per_day || !gender) {
            return res.status(400).json({ error: 'All fields are required' });
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
router.get('/all', async (req, res) => {
    try {
        const labourers = await Labour.find();
        res.status(200).json(labourers);
    } catch (error) {
        console.error('Error fetching labourers:', error);
        res.status(500).json({ error: 'Failed to fetch labourers' });
    }
});

// Add database connection test route
router.get('/test', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };

        if (dbState !== 1) {
            throw new Error(`Database is ${states[dbState]}`);
        }

        // Try to write and read a test document
        const testLabour = new Labour({
            name: 'Test User',
            location: 'Test Location',
            phone: '1234567890',
            rent_per_day: 100,
            gender: 'male'
        });
        await testLabour.save();
        await Labour.findByIdAndDelete(testLabour._id);

        res.json({
            success: true,
            message: 'Database connection successful',
            state: states[dbState]
        });
    } catch (error) {
        console.error('Database test failed:', error);
        res.status(500).json({
            success: false,
            error: 'Database connection test failed',
            details: error.message
        });
    }
});

module.exports = router;
