const express = require('express');
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getDashboardStats,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getUsers);

router.route('/stats')
  .get(protect, admin, getDashboardStats);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
