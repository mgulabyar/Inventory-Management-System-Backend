const express = require('express');
const router = express.Router();
const { createPurchaseOrder, getPurchaseOrders, getPurchaseOrderById, updatePurchaseOrder, deletePurchaseOrder } = require('../controllers/purchaseOrderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('SuperAdmin', 'Admin', 'WarehouseManager'), createPurchaseOrder)
    .get(protect, getPurchaseOrders);

router.route('/:id')
    .get(protect, getPurchaseOrderById)
    .put(protect, authorize('SuperAdmin', 'Admin', 'WarehouseManager'), updatePurchaseOrder)
    .delete(protect, authorize('SuperAdmin', 'Admin'), deletePurchaseOrder);

module.exports = router;
