const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('../dbConnect'); // Adjust the path as necessary
// Ensure you have the correct path to your dbConnect.js file

const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.query('SELECT * FROM users');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/user', async (req, res) => {
    const { name, password } = req.query;

    if (!name || !password) {
        return res.status(400).json({ error: 'name and password required' });
    }
    //return res.json({ username:name, userpassword:password  });
    try {
        const db = await connectDB();
        const result = await db.query('SELECT * FROM users WHERE name=? AND password=?',[name, password]);
            

        if (result.length > 0) {
            res.json({ success: true, message: 'Login successful', user: result[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/user', async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        console.log('Received data:', req.body);
        console.log('Received A:', name, email, password, address);

        if (!name || !email || !password || !address) {
            return res.status(400).json({ error: 'Name, email, password, and address are required' });
        }
        const db = await connectDB();
        await db.query(`INSERT INTO users (name, email, password, address) VALUES ('${name}', '${email}', '${password}', '${address}')`);
        res.json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;