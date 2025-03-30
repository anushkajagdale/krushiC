const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const cattleRoutes = require('./routes/cattle');
const grainRoutes = require('./routes/grains');
const labourRoutes = require('./routes/labour');
const equipmentRoutes = require('./routes/equipment'); // Ensure this file is not empty
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'https://anushkajagdale.github.io'], // Add the GitHub Pages URL
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/kurshiconnect')
    .then(() => {
        console.log('✅ Connected to MongoDB successfully');
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit if cannot connect to database
    });

// Routes
app.use('/api/cattle', cattleRoutes);
app.use('/api/grains', grainRoutes);
app.use('/api/labour', labourRoutes);
app.use('/api/equipment', equipmentRoutes); // Ensure this route is valid
app.use('/api/auth', authRoutes);

// Test endpoint
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
