import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setTokenCookies,
  clearTokenCookies,
} from '../utils/generateToken.js';
import { sendOTPEmail } from '../utils/sendEmail.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists', 400);
  }

  // Create user
  const user = await User.create({ name, email, password });

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token to DB
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Set cookies
  setTokenCookies(res, accessToken, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user: user.toJSON(),
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.isBlocked) {
    throw new AppError('Your account has been blocked. Contact support.', 403);
  }

  // Check if user registered via Google (no password set)
  if (!user.password) {
    throw new AppError('This account uses Google sign-in. Please login with Google.', 400);
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Set cookies
  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: user.toJSON(),
  });
});

/**
 * @desc    Google OAuth login/register
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new AppError('Google credential is required', 400);
  }

  // Decode the Google JWT (in production, verify with Google's public keys)
  const decoded = jwt.decode(credential);

  if (!decoded || !decoded.email) {
    throw new AppError('Invalid Google credential', 400);
  }

  const { email, name, picture, sub: googleId } = decoded;

  // Find or create user
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  if (user) {
    // Update Google ID if not set (user previously registered with email)
    if (!user.googleId) {
      user.googleId = googleId;
    }
    if (picture && !user.avatar.url) {
      user.avatar.url = picture;
    }
  } else {
    // Create new user
    user = await User.create({
      name,
      email,
      googleId,
      avatar: { url: picture || '' },
    });
  }

  if (user.isBlocked) {
    throw new AppError('Your account has been blocked. Contact support.', 403);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Google login successful',
    user: user.toJSON(),
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public (with refresh token cookie)
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new AppError('No refresh token. Please log in.', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Invalid or expired refresh token. Please log in again.', 401);
  }

  // Find user and verify stored refresh token
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new AppError('Invalid refresh token. Please log in again.', 401);
  }

  // Generate new access token
  const accessToken = generateAccessToken(user._id);

  // Set new access token cookie
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Token refreshed',
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // Clear refresh token in DB
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  }

  clearTokenCookies(res);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (avatar) updates.avatar = avatar;

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated',
    user,
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Please provide current and new password', 400);
  }

  if (newPassword.length < 8) {
    throw new AppError('New password must be at least 8 characters', 400);
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user.password) {
    throw new AppError('This account uses Google sign-in. Set a password first.', 400);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * @desc    Forgot password — send OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Please provide your email address', 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal whether email exists (security)
    res.status(200).json({
      success: true,
      message: 'If an account with this email exists, a reset code has been sent.',
    });
    return;
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  // Hash OTP before storing
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

  user.resetPasswordOTP = hashedOTP;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });

  // Send OTP email
  try {
    await sendOTPEmail(email, otp, user.name);
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError('Failed to send reset email. Please try again later.', 500);
  }

  res.status(200).json({
    success: true,
    message: 'If an account with this email exists, a reset code has been sent.',
  });
});

/**
 * @desc    Reset password with OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new AppError('Please provide email, OTP, and new password', 400);
  }

  if (newPassword.length < 8) {
    throw new AppError('Password must be at least 8 characters', 400);
  }

  // Hash the provided OTP to compare
  const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({
    email,
    resetPasswordOTP: hashedOTP,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+resetPasswordOTP +resetPasswordExpires');

  if (!user) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. You can now log in.',
  });
});

/**
 * @desc    Add/update user address
 * @route   POST /api/auth/addresses
 * @access  Private
 */
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { label, fullName, phone, street, city, state, pincode, country, isDefault } = req.body;

  // If setting as default, unset other defaults
  if (isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  // If first address, make it default
  const shouldBeDefault = user.addresses.length === 0 || isDefault;

  user.addresses.push({
    label,
    fullName,
    phone,
    street,
    city,
    state,
    pincode,
    country,
    isDefault: shouldBeDefault,
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: 'Address added',
    addresses: user.addresses,
  });
});

/**
 * @desc    Update user address
 * @route   PUT /api/auth/addresses/:addressId
 * @access  Private
 */
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  const { isDefault, ...updates } = req.body;

  // If setting as default, unset other defaults
  if (isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  Object.assign(address, updates, { isDefault: isDefault ?? address.isDefault });
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address updated',
    addresses: user.addresses,
  });
});

/**
 * @desc    Delete user address
 * @route   DELETE /api/auth/addresses/:addressId
 * @access  Private
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    throw new AppError('Address not found', 404);
  }

  address.deleteOne();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted',
    addresses: user.addresses,
  });
});
