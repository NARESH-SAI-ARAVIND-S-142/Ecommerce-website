import Coupon from '../models/Coupon.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get coupon by code
 * @route   GET /api/coupons/:code
 * @access  Public
 */
export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });

  if (!coupon) {
    throw new AppError('Invalid coupon code', 404);
  }

  if (!coupon.isActive || new Date(coupon.expiryDate) < new Date()) {
    throw new AppError('Coupon is expired or inactive', 400);
  }

  res.status(200).json({
    success: true,
    coupon,
  });
});
