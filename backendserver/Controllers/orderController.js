const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
const connectDB = require('../dbConnect'); // Adjust the path as necessary
// Ensure you have the correct path to your dbConnect.js file

const router = express.Router();

// Create a new order
router.post('/order', async (req, res) => {
    let db;
    try {
        const { userID, products, totalAmount } = req.body;
        console.log('Received data:', req.body);
        console.log('Received data:', products.length);

        if (!userID || !products || products.length === 0 || !totalAmount) {
            return res.status(400).json({ error: 'userID, products, and totalAmount are required' });
        }

        const db = await connectDB();

        // Start transaction
        await db.beginTransaction();

        // Insert into orders table
        const orderQuery = 'INSERT INTO orders (userID, orderDate, orderAmount) VALUES (?, GETDATE(), ?)';
        const orderResult = await db.query(orderQuery, [userID, totalAmount]);

        // Fetch the newly created orderID
        const orderIDResult = await db.query('SELECT @@IDENTITY AS orderID');
        const orderID = orderIDResult[0].orderID;

        // Insert each product into orderitems table
        for (const item of products) {
            const itemQuery = 'INSERT INTO orderitems (orderID, productID) VALUES (?, ?)';
            await db.query(itemQuery, [orderID, item.productID]);
        }

        await db.commit();

        res.json({ message: 'Order placed successfully', orderID });

    } catch (error) {
        console.error('Order creation failed:', error);
        try {
            await db.rollback();
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

// Get all orders for a specific user, along with product names
router.get('/order/:userid', async (req, res) => {
    try {
        const { userid } = req.params;

        if (!userid) {
            return res.status(400).json({ error: 'Login required' });
        }

        const db = await connectDB();

        // Step 1: Fetch orders for the user
        const ordersResult = await db.query('SELECT * FROM orders WHERE userID = ? ORDER BY orderDate DESC', [userid]);
        const orders = ordersResult;

        if (orders.length === 0) {
            return res.json([]);
        }

        // Step 2: Get all orderIDs
        const orderIDs = orders.map(order => order.orderID);
        const placeholders = orderIDs.map(() => '?').join(', ');

        // Step 3: Fetch order items with product names and images using JOIN
        const orderItemsResult = await db.query(
            `SELECT oi.orderID, oi.productID, p.name, p.product_image 
             FROM orderitems oi
             JOIN product p ON oi.productID = p.productID
             WHERE oi.orderID IN (${placeholders})`,
            orderIDs
        );

        // Step 4: Group order items by orderID
        const orderItemsMap = {};
        orderItemsResult.forEach(item => {
            if (!orderItemsMap[item.orderID]) {
                orderItemsMap[item.orderID] = [];
            }
            orderItemsMap[item.orderID].push({ 
                name: item.name,
                image: item.product_image
            });
        });

        // Step 5: Build final response
        // Step 5: Build final response
const detailedOrders = orders.map(order => ({
    orderID: order.orderID,
    orderAmount: order.orderAmount,
    orderDate: order.orderDate, // ✅ Add this
    products: orderItemsMap[order.orderID] || []
}));


        res.json(detailedOrders);

    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ error: error.message });
    }
});


module.exports =router;
