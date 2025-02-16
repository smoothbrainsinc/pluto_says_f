const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Connect to the SQLite database
const db = new sqlite3.Database('clash/clash_data.db');

// API endpoint to fetch troops data
app.get('/api/troops', (req, res) => {
    db.all('SELECT * FROM data WHERE category = "troop"', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API endpoint to fetch buildings data
app.get('/api/buildings', (req, res) => {
    db.all('SELECT * FROM data WHERE category = "building"', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API endpoint to fetch traps data
app.get('/api/traps', (req, res) => {
    db.all('SELECT * FROM data WHERE category = "trap"', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Serve static files (your HTML, CSS, and JS)
app.use(express.static('clash'));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
