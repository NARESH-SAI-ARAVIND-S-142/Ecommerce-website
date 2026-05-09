import User from '../models/User.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.role === 'admin') {
    throw new AppError('Cannot delete an admin user', 400);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User removed',
  });
});

/**
 * @desc    Update user role
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.role = req.body.role || user.role;
  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

/**
 * @desc    Get dashboard stats
 * @route   GET /api/users/stats
 * @access  Private/Admin
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  // Aggregate stats from multiple collections
  // This is a simple implementation. In production, caching should be used.
  
  const [userCount, orderCount, totalRevenue] = await Promise.all([
    User.countDocuments(),
    import('../models/Order.js').then((module) => module.default.countDocuments()),
    import('../models/Order.js').then((module) => 
      module.default.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    )
  ]);

  res.status(200).json({
    success: true,
    stats: {
      users: userCount,
      orders: orderCount,
      revenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    }
  });
});
