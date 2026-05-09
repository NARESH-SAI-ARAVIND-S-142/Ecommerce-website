import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { uploadProductImage } from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id/related', getRelatedProducts);
router.get('/:idOrSlug', getProduct);

// Admin routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Image Upload (accepts multiple images)
router.post(
  '/upload',
  protect,
  adminOnly,
  uploadProductImage.array('images', 5),
  uploadImages
);

export default router;
