import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Load env vars
dotenv.config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// ━━━ Global Middleware ━━━

// Security headers
app.use(helmet());

// CORS — allow frontend origin with credentials
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Request logging (dev only)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Webhooks (MUST BE BEFORE express.json()) ---
// Stripe requires the raw body to construct the event signature
app.use('/api/webhooks', webhookRoutes);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Rate limiting
app.use('/api', apiLimiter);

// ━━━ API Routes ━━━

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NexMart API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// ━━━ Start Server ━━━

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║         🚀 NexMart API Server           ║
  ║──────────────────────────────────────────║
  ║  Port:        ${String(PORT).padEnd(27)}║
  ║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(27)}║
  ║  API:         http://localhost:${String(PORT).padEnd(10)}║
  ╚══════════════════════════════════════════╝
  `);
});

export default app;
