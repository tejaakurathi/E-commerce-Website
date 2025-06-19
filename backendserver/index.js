const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path =require('path')
// Import controllers
const productController = require('./Controllers/productController');
const orderController = require('./Controllers/orderController');
const userController = require('./Controllers/userController');
const categoryController = require('./Controllers/categoryController');
const cartController =require('./Controllers/cartController')

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api/images', express.static(path.join(__dirname, 'images')));
app.use('/api', productController);
app.use('/api', orderController);
app.use('/api', userController);
app.use('/api', categoryController);
app.use('/api', cartController);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
