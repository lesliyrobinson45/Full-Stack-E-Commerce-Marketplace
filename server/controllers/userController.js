const User = require('../models/user');
const Order = require('../models/order');
const Product = require('../models/product');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin user');
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics statistics
// @route   GET /api/users/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    
    // Revenue aggregation
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Sales by category helper
    const orders = await Order.find({ isPaid: true }).populate('orderItems.product');
    const categorySales = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.product) {
          const category = item.product.category || 'Other';
          const salesVal = item.price * item.quantity;
          categorySales[category] = (categorySales[category] || 0) + salesVal;
        }
      });
    });

    const formattedCategorySales = Object.keys(categorySales).map(key => ({
      name: key,
      value: Math.round(categorySales[key] * 100) / 100
    }));

    // Monthly sales over the last 6 months
    const monthlySales = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const monthOrders = await Order.find({
        isPaid: true,
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      const revenue = monthOrders.reduce((acc, o) => acc + o.totalPrice, 0);
      const name = startOfMonth.toLocaleString('default', { month: 'short' });
      monthlySales.push({
        month: name,
        sales: Math.round(revenue * 100) / 100,
        orders: monthOrders.length
      });
    }

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      categorySales: formattedCategorySales,
      monthlySales
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  getDashboardStats,
};
