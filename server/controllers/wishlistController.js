import User from '../models/User.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get user wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'wishlist',
    'name slug brand category variants ratings'
  );

  res.status(200).json({
    success: true,
    count: user.wishlist.length,
    wishlist: user.wishlist,
  });
});

/**
 * @desc    Toggle product in wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private
 */
export const toggleWishlistItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  const isLiked = user.wishlist.includes(productId);

  if (isLiked) {
    // Remove from wishlist
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId.toString());
  } else {
    // Add to wishlist
    user.wishlist.push(productId);
  }

  await user.save();

  // Populate before returning
  const updatedUser = await User.findById(req.user._id).populate(
    'wishlist',
    'name slug brand category variants ratings'
  );

  res.status(200).json({
    success: true,
    action: isLiked ? 'removed' : 'added',
    wishlist: updatedUser.wishlist,
  });
});
