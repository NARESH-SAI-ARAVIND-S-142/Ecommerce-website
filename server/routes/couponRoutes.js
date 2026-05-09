import { Router } from 'express';
import { getCoupon } from '../controllers/couponController.js';

const router = Router();

router.get('/:code', getCoupon);

export default router;
