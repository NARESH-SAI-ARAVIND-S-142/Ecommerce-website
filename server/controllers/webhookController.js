import Stripe from 'stripe';
import Order from '../models/Order.js';
import User from '../models/User.js';
import generateInvoicePDF from '../utils/invoice.js';
import { sendOrderConfirmationEmail } from '../utils/sendEmail.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Handle Stripe Webhooks
 * @route   POST /api/webhooks/stripe
 * @access  Public (Called by Stripe)
 */
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // req.body must be raw buffer for signature verification
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // The order ID should have been passed in the metadata when creating the payment intent
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      try {
        const order = await Order.findById(orderId).populate('user', 'name email');
        
        if (order && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: Date.now().toString(),
            email_address: order.user.email,
          };
          
          order.statusHistory.push({
            status: 'Processing',
            comment: 'Payment verified via Stripe webhook',
          });

          await order.save();
          console.log(`Order ${orderId} marked as paid via webhook.`);

          // Generate Invoice and Send Email
          const pdfBuffer = await generateInvoicePDF(order);
          await sendOrderConfirmationEmail(order.user.email, order, order.user.name, pdfBuffer);
        }
      } catch (error) {
        console.error('Error processing successful payment webhook:', error);
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};
