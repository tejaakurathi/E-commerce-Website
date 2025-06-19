const express = require('express');
const connectDB = require('../dbConnect');

const router = express.Router();

// Get Cart for a User
router.get('/cart/:userID', async (req, res) => {
    let db;
    try {
        const userID = req.params.userID;

        db = await connectDB();

        // Fetch cart details
        const cartResult = await db.query('SELECT * FROM cart WHERE userID = ?', [userID]);

        if (cartResult.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartID = cartResult[0].cartID;
        const cartAmount = cartResult[0].cartAmount;

        // Fetch cart items with product details
        const cartItems = await db.query(
            'SELECT ci.productID, p.name, p.price,p.product_image FROM cartItems ci INNER JOIN product p ON ci.productID = p.productID WHERE ci.cartID = ?',
            [cartID]
        );

        res.json({ cartID, cartAmount, cartItems });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: error.message });
    } finally {
        if (db && db.close) db.close();
    }
});

// Add Product to Cart
router.post('/cart/add/:productID', async (req, res) => {
    let db;
    try {
        const { userID } = req.body;
        const productID = req.params.productID;

        if (!userID || !productID) {
            return res.status(400).json({ error: 'userID and productID are required' });
        }

        db = await connectDB();
        await db.beginTransaction();

        // Get product price
        const productResult = await db.query('SELECT price FROM product WHERE productID = ?', [productID]);
        if (productResult.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const productPrice = productResult[0].price;

        // Check if cart exists for the user
        const cartResult = await db.query('SELECT * FROM cart WHERE userID = ?', [userID]);
        let cartID;

        if (cartResult.length === 0) {
            // Create new cart
            await db.query('INSERT INTO cart (userID, cartAmount) VALUES (?, ?)', [userID, productPrice]);
            const cartIDResult = await db.query('SELECT @@IDENTITY AS cartID');
            cartID = cartIDResult[0].cartID;
        } else {
            cartID = cartResult[0].cartID;

            // Update cart amount
            await db.query('UPDATE cart SET cartAmount = cartAmount + ? WHERE cartID = ?', [productPrice, cartID]);
        }

        // Add product to cart items
        await db.query('INSERT INTO cartItems (cartID, productID) VALUES (?, ?)', [cartID, productID]);

        await db.commit();
        res.json({ message: 'Product added to cart successfully', cartID });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        try {
            if (db && db.rollback) await db.rollback();
        } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
        }
        res.status(500).json({ error: error.message });
    } finally {
        if (db && db.close) db.close();
    }
});

// Remove Product from Cart
router.delete('/cart/remove/:productID', async (req, res) => {
    let db;
    try {
        const { userID } = req.body;
        const productID = req.params.productID;

        if (!userID || !productID) {
            return res.status(400).json({ error: 'userID and productID are required' });
        }

        db = await connectDB();
        await db.beginTransaction();

        // Get product price
        const productResult = await db.query('SELECT price FROM product WHERE productID = ?', [productID]);
        if (productResult.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        const productPrice = productResult[0].price;

        // Get cart for user
        const cartResult = await db.query('SELECT * FROM cart WHERE userID = ?', [userID]);
        if (cartResult.length === 0) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        const cartID = cartResult[0].cartID;

        // Check if the product exists in cartItems
        const itemCheck = await db.query('SELECT * FROM cartItems WHERE cartID = ? AND productID = ?', [cartID, productID]);
        if (itemCheck.length === 0) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }

        // Delete from cartItems
        await db.query('DELETE FROM cartItems WHERE cartID = ? AND productID = ?', [cartID, productID]);

        // Update cart amount
        await db.query('UPDATE cart SET cartAmount = cartAmount - ? WHERE cartID = ?', [productPrice, cartID]);

        await db.commit();
        res.json({ message: 'Product removed from cart successfully', cartID });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        try {
            if (db && db.rollback) await db.rollback();
        } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
        }
        res.status(500).json({ error: error.message });
    } finally {
        if (db && db.close) db.close();
    }
});

// Buy Cart (Create Order)
router.post('/cart/buy', async (req, res) => {
    let db;
    try {
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).json({ error: 'userID is required' });
        }

        db = await connectDB();
        await db.beginTransaction();

        // Check if cart exists
        const cartResult = await db.query('SELECT * FROM cart WHERE userID = ?', [userID]);
        if (cartResult.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cartID = cartResult[0].cartID;
        const cartAmount = cartResult[0].cartAmount;

        // Get all cart items
        const cartItems = await db.query('SELECT * FROM cartItems WHERE cartID = ?', [cartID]);
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Create a new order
        await db.query('INSERT INTO orders (userID, orderAmount, orderDate) VALUES (?, ?, GETDATE())', [userID, cartAmount]);
        const orderIDResult = await db.query('SELECT @@IDENTITY AS orderID');
        const orderID = orderIDResult[0].orderID;

        // Move cart items to order items
        for (const item of cartItems) {
            await db.query('INSERT INTO orderItems (orderID, productID) VALUES (?, ?)', [orderID, item.productID]);
        }

        // Clear cart items
        await db.query('DELETE FROM cartItems WHERE cartID = ?', [cartID]);

        // Reset cart amount
        await db.query('UPDATE cart SET cartAmount = 0 WHERE cartID = ?', [cartID]);

        await db.commit();
        res.json({ message: 'Order placed successfully', orderID });
    } catch (error) {
        console.error('Error placing order:', error);
        try {
            if (db && db.rollback) await db.rollback();
        } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
        }
        res.status(500).json({ error: error.message });
    } finally {
        if (db && db.close) db.close();
    }
});

module.exports = router;
