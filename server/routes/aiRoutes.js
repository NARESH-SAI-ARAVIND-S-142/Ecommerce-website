import express from 'express';
import { chatWithAI } from '../controllers/aiController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Use stricter rate limiting for AI endpoint to prevent API abuse
router.post('/chat', apiLimiter, chatWithAI);

export default router;
