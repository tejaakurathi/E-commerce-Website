const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import controllers
const productController = require('./Controllers/productController');
const orderController = require('./Controllers/orderController');
const userController = require('./Controllers/userController');
const categoryController = require('./Controllers/categoryController');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Register all controllers under /api
app.use('/api', productController);
app.use('/api', orderController);
app.use('/api', userController);
app.use('/api', categoryController);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
