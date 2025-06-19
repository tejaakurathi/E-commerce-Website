const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('../dbConnect'); // Adjust the path as necessary

const router = express.Router();

// Serve static images from the 'public/images' folder (adjust path as needed)

// Get all products
router.get('/products', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.query('SELECT * FROM product');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific product by product ID
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const db = await connectDB();
        const result = await db.query('SELECT * FROM product WHERE productID = ?', [productId]);

        const products = result.map(product =>({
            ...product,
            product_image:`${product.product_image}`
        }));

        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all products in a specific category
router.get('/products/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;

        const db = await connectDB();
        const result = await db.query('SELECT * FROM product WHERE categoryID = ?', [categoryId]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// router.get('/products', async (req, res) => {
//     try {
//         const db = await connectDB();
//         const result = await db.query('SELECT * FROM product');
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

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