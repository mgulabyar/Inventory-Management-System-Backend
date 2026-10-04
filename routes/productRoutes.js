const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('SuperAdmin', 'Admin', 'WarehouseManager'), createProduct)
    .get(protect, getProducts);

router.route('/:id')
    .get(protect, getProductById)
    .put(protect, authorize('SuperAdmin', 'Admin', 'WarehouseManager'), updateProduct)
    .delete(protect, authorize('SuperAdmin', 'Admin'), deleteProduct);

module.exports = router;
