const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const cattleRoutes = require('./routes/cattle');
const dealCattleRoutes = require('./routes/deal-cattle');
const sellCattleRoutes = require('./routes/sell-cattle');
const grainRoutes = require('./routes/grains');
const equipmentRoutes = require('./routes/equipment');
const labourRoutes = require('./routes/labour');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize SQLite database
const db = new sqlite3.Database('./database/farmer.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables if they don't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            image TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            location TEXT NOT NULL,
            sellerName TEXT NOT NULL,
            sellerContact TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS cattle (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            breed TEXT NOT NULL,
            image TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            sellerName TEXT NOT NULL,
            sellerContact TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            image TEXT NOT NULL,
            rent REAL NOT NULL,
            location TEXT NOT NULL,
            sellerName TEXT NOT NULL,
            sellerContact TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS labour (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            phone TEXT NOT NULL,
            rent_per_day REAL NOT NULL,
            gender TEXT NOT NULL
        )
    `);
});

// Endpoint to fetch all products (grains)
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            res.status(500).json({ error: 'Failed to fetch products' });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Endpoint to add a new product (grain)
app.post('/api/products', (req, res) => {
    const { name, image, quantity, price, location, sellerName, sellerContact } = req.body;

    if (!name || !quantity || !price || !location || !sellerName || !sellerContact) {
        console.error('Validation failed: Missing required fields');
        return res.status(400).json({ error: 'All fields except image are required' });
    }

    const query = `
        INSERT INTO products (name, image, quantity, price, location, sellerName, sellerContact)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [name, image || 'default.jpg', quantity, price, location, sellerName, sellerContact], function (err) {
        if (err) {
            console.error('Error adding product:', err.message);
            return res.status(500).json({ error: 'Failed to add product' });
        }
        res.status(201).json({ id: this.lastID, ...req.body });
    });
});

// Endpoint to delete a product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Error deleting product:', err.message);
            res.status(500).json({ error: 'Failed to delete product' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.status(200).json({ message: 'Product deleted successfully' });
        }
    });
});

// Endpoint to register a labourer
app.post('/api/labour/register', (req, res) => {
    const { name, location, phone, rent_per_day, gender } = req.body;

    if (!name || !location || !phone || !rent_per_day || !gender) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = `
        INSERT INTO labour (name, location, phone, rent_per_day, gender)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [name, location, phone, rent_per_day, gender], function (err) {
        if (err) {
            console.error('Error registering labour:', err.message);
            return res.status(500).json({ error: 'Failed to register labour. Please check the database connection.' });
        }
        res.status(201).json({ id: this.lastID, name, location, phone, rent_per_day, gender });
    });
});

// Endpoint to fetch all labourers
app.get('/api/labour', (req, res) => {
    const query = `SELECT * FROM labour`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching labour:', err.message);
            return res.status(500).json({ error: 'Failed to fetch labour.' });
        }
        res.status(200).json(rows);
    });
});

// Endpoint to fetch all grains
app.get('/api/grains', (req, res) => {
    const query = `SELECT * FROM products`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching grains:', err.message);
            return res.status(500).json({ error: 'Failed to fetch grains.' });
        }
        res.status(200).json(rows);
    });
});

// Endpoint to add a new grain
app.post('/api/grains', (req, res) => {
    const { name, image, quantity, price, location, sellerName, sellerContact } = req.body;

    if (!name || !image || !quantity || !price || !location || !sellerName || !sellerContact) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = `
        INSERT INTO products (name, image, quantity, price, location, sellerName, sellerContact)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [name, image, quantity, price, location, sellerName, sellerContact], function (err) {
        if (err) {
            console.error('Error adding grain:', err.message);
            return res.status(500).json({ error: 'Failed to add grain.' });
        }
        res.status(201).json({ id: this.lastID, name, image, quantity, price, location, sellerName, sellerContact });
    });
});

// Endpoint to fetch all rented equipment
app.get('/api/equipment', (req, res) => {
    db.all('SELECT * FROM equipment', [], (err, rows) => {
        if (err) {
            console.error('Error fetching equipment:', err.message);
            res.status(500).json({ error: 'Failed to fetch equipment' });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Endpoint to add a new rented equipment
app.post('/api/equipment', (req, res) => {
    console.log('Request Body:', req.body); // Log the incoming request body

    const { name, image, rent, location, sellerName, sellerContact } = req.body;

    if (!name || !rent || !location || !sellerName || !sellerContact) {
        console.error('Validation failed: Missing required fields');
        return res.status(400).json({ error: 'All fields except image are required' });
    }

    const query = `
        INSERT INTO equipment (type, image, rent, location, sellerName, sellerContact)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [name, image || 'default.jpg', rent, location, sellerName, sellerContact], function (err) {
        if (err) {
            console.error('Error adding equipment:', err.message);
            return res.status(500).json({ error: 'Failed to add equipment' });
        }
        res.status(201).json({ id: this.lastID, ...req.body });
    });
});

// Test endpoint to verify server is running
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/kurshiconnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Cattle routes
app.use('/api/cattle', cattleRoutes);

// Cattle deal routes
app.use('/api/deal-cattle', dealCattleRoutes);

// Sell Cattle routes
app.use('/api/sell-cattle', sellCattleRoutes);

// Grain routes
app.use('/api/grains', grainRoutes);

// Equipment routes
app.use('/api/equipment', equipmentRoutes);

// Labour routes
app.use('/api/labour', labourRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

let grains = []; // In-memory storage for grain details
