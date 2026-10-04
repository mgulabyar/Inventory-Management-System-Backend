const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrder, deleteOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('SuperAdmin', 'Admin', 'SalesCashier'), createOrder)
    .get(protect, authorize('SuperAdmin', 'Admin'), getOrders);

router.route('/:id')
    .get(protect, getOrderById)
    .put(protect, authorize('SuperAdmin', 'Admin'), updateOrder)
    .delete(protect, authorize('SuperAdmin', 'Admin'), deleteOrder);

module.exports = router;
