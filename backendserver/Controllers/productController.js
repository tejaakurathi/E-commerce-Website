const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('../dbConnect'); // Adjust the path as necessary
// Ensure you have the correct path to your dbConnect.js file

const router = express.Router();

router.get('/products', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.query('SELECT * FROM product');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params; 
       // return res.json(id);
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const db = await connectDB();
        const result = await db.query('SELECT * FROM product WHERE productID = ?', [id]);  // ✅ Parameterized Query

        if (result.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/product', async (req, res) => {
    try {
        const { name, price, categoryID } = req.body;
        console.log('Received data:', req.body);
        console.log('Received A:', name, price, categoryID);

        if (!name || !price || !categoryID) {
            return res.status(400).json({ error: 'Name, price, and categoryID are required' });
        }
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: 'Price must be a positive number' });
        }
        const db = await connectDB();
        await db.query(`INSERT INTO product (name, price, categoryID) VALUES ('${name}', ${price}, ${categoryID})`);
        res.json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports= router;