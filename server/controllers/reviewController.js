import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Create new review
 * @route   POST /api/reviews
 * @access  Private
 */
export const createReview = asyncHandler(async (req, res) => {
  const { product: productId, rating, title, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check if user already reviewed
  const existingReview = await Review.findOne({ product: productId, user: req.user._id });
  if (existingReview) {
    throw new AppError('You have already reviewed this product', 400);
  }

  // Check if verified purchase (has a delivered order containing this product)
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'orderItems.product': productId,
    isDelivered: true,
  });

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    title,
    comment,
    isVerifiedPurchase: !!hasPurchased,
  });

  // Calculate new average rating for product
  const reviews = await Review.find({ product: productId });
  product.ratings.count = reviews.length;
  product.ratings.average = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await product.save();

  res.status(201).json({
    success: true,
    review,
  });
});

/**
 * @desc    Get reviews for a product
 * @route   GET /api/reviews/:productId
 * @access  Public
 */
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});
