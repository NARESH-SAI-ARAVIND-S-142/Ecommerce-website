import nodemailer from 'nodemailer';

/**
 * Create reusable transporter. Falls back to console logging in dev if SMTP is not configured.
 */
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

/**
 * Send email using Nodemailer. In development without SMTP config, logs to console.
 */
const sendEmail = async ({ to, subject, html, attachments }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('📧 Email (dev mode - no SMTP configured):');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${html.substring(0, 200)}...`);
    return { messageId: 'dev-mode' };
  }

  const mailOptions = {
    from: `"NexMart" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    attachments,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent: ${info.messageId}`);
  return info;
};

/**
 * Email template: OTP for password reset
 */
export const sendOTPEmail = async (email, otp, name) => {
  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1E; color: #E2E8F0; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-family: 'Sora', sans-serif; font-size: 28px; background: linear-gradient(135deg, #6C47FF, #00C9A7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">NexMart</h1>
      </div>
      <h2 style="font-size: 20px; color: #fff; margin-bottom: 16px;">Password Reset Request</h2>
      <p style="color: #94A3B8; line-height: 1.6;">Hi ${name || 'there'},</p>
      <p style="color: #94A3B8; line-height: 1.6;">Use the verification code below to reset your password. This code expires in 10 minutes.</p>
      <div style="background: linear-gradient(135deg, rgba(108,71,255,0.15), rgba(0,201,167,0.15)); border: 1px solid rgba(108,71,255,0.3); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #6C47FF;">${otp}</span>
      </div>
      <p style="color: #64748B; font-size: 14px; line-height: 1.6;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
      <hr style="border: none; border-top: 1px solid rgba(148,163,184,0.1); margin: 32px 0;" />
      <p style="color: #475569; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} NexMart. All rights reserved.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'NexMart — Password Reset Code',
    html,
  });
};

/**
 * Email template: Order confirmation
 */
export const sendOrderConfirmationEmail = async (email, order, name, pdfBuffer) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid rgba(148,163,184,0.1); color: #E2E8F0;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid rgba(148,163,184,0.1); color: #94A3B8; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid rgba(148,163,184,0.1); color: #00C9A7; text-align: right;">₹${item.price.toLocaleString()}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; background: #0A0F1E; color: #E2E8F0; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-family: 'Sora', sans-serif; font-size: 28px; background: linear-gradient(135deg, #6C47FF, #00C9A7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">NexMart</h1>
      </div>
      <div style="background: rgba(0,201,167,0.1); border: 1px solid rgba(0,201,167,0.3); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <p style="color: #00C9A7; font-size: 18px; font-weight: 600; margin: 0;">✅ Order Confirmed!</p>
      </div>
      <p style="color: #94A3B8; line-height: 1.6;">Hi ${name},</p>
      <p style="color: #94A3B8; line-height: 1.6;">Thank you for your order. Here's your order summary:</p>
      <p style="color: #6C47FF; font-weight: 600;">Order ID: #${order._id.toString().slice(-8).toUpperCase()}</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="border-bottom: 2px solid rgba(108,71,255,0.3);">
            <th style="padding: 12px; text-align: left; color: #6C47FF; font-size: 14px;">Item</th>
            <th style="padding: 12px; text-align: center; color: #6C47FF; font-size: 14px;">Qty</th>
            <th style="padding: 12px; text-align: right; color: #6C47FF; font-size: 14px;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div style="background: rgba(108,71,255,0.1); border-radius: 8px; padding: 16px; margin-top: 16px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #94A3B8;">Subtotal</span>
          <span style="color: #E2E8F0;">₹${order.totals.subtotal.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #94A3B8;">Shipping</span>
          <span style="color: #E2E8F0;">₹${order.totals.shipping.toLocaleString()}</span>
        </div>
        ${order.totals.discount ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #94A3B8;">Discount</span><span style="color: #00C9A7;">-₹${order.totals.discount.toLocaleString()}</span></div>` : ''}
        <hr style="border: none; border-top: 1px solid rgba(108,71,255,0.3); margin: 12px 0;" />
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #fff; font-weight: 700; font-size: 18px;">Total</span>
          <span style="color: #6C47FF; font-weight: 700; font-size: 18px;">₹${order.totals.total.toLocaleString()}</span>
        </div>
      </div>
      <hr style="border: none; border-top: 1px solid rgba(148,163,184,0.1); margin: 32px 0;" />
      <p style="color: #475569; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} NexMart. All rights reserved.</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `NexMart — Order Confirmed #${order._id.toString().slice(-8).toUpperCase()}`,
    html,
    attachments: pdfBuffer ? [
      {
        filename: `invoice-${order._id.toString().slice(-8)}.pdf`,
        content: pdfBuffer,
      }
    ] : undefined
  });
};

export default sendEmail;
