const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Create a MySQL connection
const db = mysql.createConnection({
    host: 3306,
    user: 'root', // replace with your MySQL username
    password: '', // replace with your MySQL password
    database: 'crud_api',
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Create (POST) - Create a new item
app.post('/items', (req, res) => {
    const { name, description } = req.body;
    const { id } = req.params;

    console.log(`Body :${req.body.name}`);
    const query = 'INSERT INTO items (name, description) VALUES (?, ?)';
    db.query(query, [name, description], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(201).send({ id: result.insertId, name, description });
    });
});

// Read (GET) - Get all items
app.get('/items', (req, res) => {
    const query = 'SELECT * FROM items';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(results);
    });
});

// Read (GET) - Get a single item by ID
app.get('/items/:id', (req, res) => {
    const { id } = req.params;


    const query = 'SELECT * FROM items WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length === 0) {
            return res.status(404).send({ error: 'Item not found' });
        }
        res.status(200).send(results[0]);
    });
});

// Update (PUT) - Update an item by ID
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const query = 'UPDATE items SET name = ?, description = ? WHERE id = ?';
    db.query(query, [name, description, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Item not found' });
        }
        res.status(200).send({ id, name, description });
    });
});

// Delete (DELETE) - Delete an item by ID
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM items WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.affectedRows === 0) {
            return res.status(404).send({ error: 'Item not found' });
        }
        res.status(200).send({ message: 'Item deleted' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
