const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('SuperAdmin', 'Admin', 'WarehouseManager'), createCategory)
    .get(protect, getCategories);

router.route('/:id')
    .get(protect, getCategoryById)
    .put(protect, authorize('SuperAdmin', 'Admin', 'WarehouseManager'), updateCategory)
    .delete(protect, authorize('SuperAdmin', 'Admin'), deleteCategory);

module.exports = router;
