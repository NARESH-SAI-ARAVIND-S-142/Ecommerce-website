import express from 'express';
import { stripeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Stripe requires the raw body to verify the signature
// So we use express.raw({ type: 'application/json' }) just for this route
router.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
