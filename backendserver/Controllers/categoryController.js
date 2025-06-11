const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('../dbConnect'); // Adjust the path as necessary
const { route } = require('./productController');
// Ensure you have the correct path to your dbConnect.js file

const router = express.Router();

router.get('/category', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.query('SELECT * FROM category');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;