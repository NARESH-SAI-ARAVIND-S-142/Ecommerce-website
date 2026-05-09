import { Router } from 'express';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.route('/').post(protect, createReview);
router.route('/:productId').get(getProductReviews);

export default router;
