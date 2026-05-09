import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  createPaymentIntent,
  getInvoice,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Protect all order routes
router.use(protect);

router.post('/', createOrder);
router.post('/create-payment-intent', createPaymentIntent);
router.get('/myorders', getMyOrders);

// Specific ID routes
router.get('/:id', getOrderById);
router.get('/:id/invoice', getInvoice);

// Admin only routes
router.get('/', adminOnly, getOrders);
router.put('/:id/status', adminOnly, updateOrderStatus);

export default router;
