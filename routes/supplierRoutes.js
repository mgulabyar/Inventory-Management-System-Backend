const express = require('express');
const router = express.Router();
const { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier } = require('../controllers/supplierController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('SuperAdmin', 'Admin', 'WarehouseManager'), createSupplier)
    .get(protect, getSuppliers);

router.route('/:id')
    .get(protect, getSupplierById)
    .put(protect, authorize('SuperAdmin', 'Admin', 'WarehouseManager'), updateSupplier)
    .delete(protect, authorize('SuperAdmin', 'Admin'), deleteSupplier);

module.exports = router;
