const express = require('express');
const router = express.Router();
const { exportProductsToCSV } = require('../controllers/exportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/products', protect, authorize('SuperAdmin', 'Admin', 'WarehouseManager'), exportProductsToCSV);

module.exports = router;
