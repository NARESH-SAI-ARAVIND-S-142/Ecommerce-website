import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError, asyncHandler } from './errorHandler.js';

/**
 * Protect routes — verify JWT access token from cookies or Authorization header.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken;

  // Fallback: check Authorization header
  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized. Please log in.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User no longer exists.', 401);
    }

    if (user.isBlocked) {
      throw new AppError('Your account has been blocked. Contact support.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token expired. Please refresh your session.', 401);
    }
    throw new AppError('Invalid token. Please log in again.', 401);
  }
});

/**
 * Restrict to admin users only.
 */
export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    throw new AppError('Access denied. Admin privileges required.', 403);
  }
  next();
});

/**
 * Optional auth — attaches user to request if token exists, but doesn't block.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken;

  if (!token && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch {
      // Token invalid — continue without user
    }
  }

  next();
});
