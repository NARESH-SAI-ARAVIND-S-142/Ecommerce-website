import { Router } from 'express';
import { getWishlist, toggleWishlistItem } from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);
router.route('/').get(getWishlist);
router.route('/:productId').post(toggleWishlistItem);

export default router;
