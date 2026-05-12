import Order from '../models/Order.js';
import Product from '../models/Product.js';
import generateInvoicePDF from '../utils/invoice.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentResult, // From Stripe frontend if applicable
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    throw new AppError('No order items', 400);
  }

  // Double check prices on backend to prevent tampering
  // In a real app, we'd recalculate itemsPrice by querying the DB
  // For now, we trust the frontend payload as a simplification
  
  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  // If paid via Stripe already
  if (paymentResult && paymentResult.status === 'succeeded') {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResult;
  }

  const createdOrder = await order.save();

  // Deduct stock
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      const variant = product.variants.find((v) => v.sku === item.variantSku);
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.qty);
        await product.save();
      }
    }
  }

  res.status(201).json({
    success: true,
    order: createdOrder,
  });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Ensure user owns the order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this order', 403);
  }

  res.status(200).json({
    success: true,
    order,
  });
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, isDelivered } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (status) order.status = status;
  
  if (isDelivered) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';
  }

  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    order: updatedOrder,
  });
});

/**
 * @desc    Create Stripe Payment Intent
 * @route   POST /api/orders/create-payment-intent
 * @access  Private
 */
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { items } = req.body;

  // Calculate total price on backend based on DB prices
  let totalAmount = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new AppError(`Product not found: ${item.name}`, 404);
    
    const variant = product.variants.find((v) => v.sku === item.variantSku);
    if (!variant) throw new AppError(`Variant not found for: ${item.name}`, 404);
    
    if (variant.stock < item.qty) {
      throw new AppError(`Insufficient stock for ${item.name} (${variant.color || variant.size})`, 400);
    }
    
    totalAmount += variant.price * item.qty;
  }

  // Add standard shipping/tax logic here (mocked for simplicity)
  const shippingPrice = totalAmount > 499 ? 0 : 50;
  const taxPrice = Math.round(totalAmount * 0.18); // 18% GST mock
  const finalTotal = totalAmount + shippingPrice + taxPrice;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalTotal * 100, // Stripe expects smallest currency unit (paise/cents)
    currency: 'inr',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      userId: req.user._id.toString(),
    },
  });

  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
    breakdown: {
      itemsPrice: totalAmount,
      shippingPrice,
      taxPrice,
      totalPrice: finalTotal,
    }
  });
});

/**
 * @desc    Get order invoice PDF
 * @route   GET /api/orders/:id/invoice
 * @access  Private
 */
export const getInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Ensure user owns the order or is admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this invoice', 403);
  }

  try {
    const pdfBuffer = await generateInvoicePDF(order);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${order._id.toString().slice(-8)}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Invoice generation failed:', error);
    throw new AppError('Failed to generate invoice', 500);
  }
});
