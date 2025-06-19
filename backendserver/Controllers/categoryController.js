const express = require('express');
//const bodyParser = require('body-parser');
//const cors = require('cors');
const connectDB = require('../dbConnect'); // Adjust the path as necessary
//const { route } = require('./productController');
// Ensure you have the correct path to your dbConnect.js file

const router = express.Router();

router.get('/category', async (req, res) => {
    try {
        const db = await connectDB();
        const result = await db.query('SELECT * FROM category');

        // Attach image path to each category
        const categories = result.map(category => ({
            ...category,
            category_image: `${category.category_image}` // ✅ Prepend the folder path here
        }));

        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/category/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params; 
        if (!categoryId) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const db = await connectDB();
        const result = await db.query('SELECT * FROM category WHERE categoryID = ?', [categoryId]);  // ✅ Parameterized Query

        if (result.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(result[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;