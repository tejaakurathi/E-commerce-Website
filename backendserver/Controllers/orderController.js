const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('../dbConnect'); // Adjust the path as necessary
// Ensure you have the correct path to your dbConnect.js file

const router = express.Router();

// Create a new order
router.post('/order', async (req, res) => {
    try {
        const { userID, products, totalAmount } = req.body;
        console.log('Received data:', req.body);

        if (!userID || !products || products.length === 0 || !totalAmount) {
            return res.status(400).json({ error: 'userID, products, and totalAmount are required' });
        }

        const db = await connectDB();

        // Start transaction
        await db.beginTransaction();

        // Insert into orders table
        const orderQuery = `INSERT INTO orders (userID, orderDate, totalAmount) VALUES (?, GETDATE(), ?)`;
        const orderResult = await db.query(orderQuery, [userID, totalAmount]);

        // Fetch the newly created orderID
        const orderIDResult = await db.query(`SELECT @@IDENTITY AS orderID`);
        const orderID = orderIDResult[0].orderID;

        // Insert each product into orderitems table
        for (const item of products) {
            const itemQuery = `INSERT INTO orderitems (orderID, productID, quantity) VALUES (?, ?, ?)`;
            await db.query(itemQuery, [orderID, item.productID, item.quantity]);
        }

        await db.commitTransaction();

        res.json({ message: 'Order placed successfully', orderID });

    } catch (error) {
        console.error('Order creation failed:', error);
        try {
            await db.rollbackTransaction();
        } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
        }
        res.status(500).json({ error: error.message });
    }
});

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.query('SELECT * FROM orders');
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports =router;
