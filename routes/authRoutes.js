const express = require('express');
const router = express.Router();
const { loginUser, createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/login', loginUser);

router.route('/users')
  .post(protect, authorize('SuperAdmin', 'Admin'), createUser)
  .get(protect, authorize('SuperAdmin', 'Admin'), getUsers);

router.route('/users/:id')
  .get(protect, authorize('SuperAdmin', 'Admin'), getUserById)
  .put(protect, authorize('SuperAdmin', 'Admin'), updateUser)
  .delete(protect, authorize('SuperAdmin', 'Admin'), deleteUser);

module.exports = router;
