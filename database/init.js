const fs = require('fs');
const path = require('path');
const db = require('./config');

// Read schema file
const schemaPath = path.resolve(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Execute schema
db.serialize(() => {
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing the database:', err.message);
        } else {
            console.log('Database initialized successfully.');
        }
    });
});
