import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineKey } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { sendResetEmail, confirmReset, loading, error, message, resetError, resetMessage } = useAuth();

  useEffect(() => {
    if (error) { toast.error(error); resetError(); }
  }, [error, resetError]);

  useEffect(() => {
    if (message && step === 1) { toast.success('Reset code sent to your email'); setStep(2); resetMessage(); }
    if (message && step === 3) { toast.success('Password reset successfully!'); resetMessage(); }
  }, [message, step, resetMessage]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) { setErrors({ email: 'Valid email required' }); return; }
    setErrors({});
    await sendResetEmail(email);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { setErrors({ otp: 'Enter 6-digit code' }); return; }
    setErrors({});
    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newPassword || newPassword.length < 8) errs.newPassword = 'Min 8 characters';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    await confirmReset({ email, otp, newPassword });
  };

  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-navy to-cyan/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl" />

      <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="relative z-10 w-full max-w-md">
        <motion.div variants={item} className="glass-strong rounded-2xl p-8 shadow-glass">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-cyan flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">N</span>
              </div>
              <span className="font-heading font-bold text-2xl gradient-text">NexMart</span>
            </Link>
            <h1 className="font-heading text-2xl font-bold text-white mb-2">
              {step === 1 ? 'Forgot Password?' : step === 2 ? 'Enter Reset Code' : 'New Password'}
            </h1>
            <p className="text-gray-500 text-sm">
              {step === 1 ? 'Enter your email to receive a reset code' : step === 2 ? `We sent a 6-digit code to ${email}` : 'Choose a strong new password'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-gradient-to-r from-violet to-cyan' : 'bg-white/10'}`} />
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <Input label="Email Address" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({}); }} error={errors.email} icon={<HiOutlineMail size={18} />} required />
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>Send Reset Code</Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <Input label="6-Digit Code" value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setErrors({}); }} error={errors.otp} icon={<HiOutlineKey size={18} />} maxLength={6} required />
              <Button type="submit" variant="primary" size="lg" fullWidth>Verify Code</Button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-violet transition-colors">Resend code</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <Input label="New Password" type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setErrors({}); }} error={errors.newPassword} icon={<HiOutlineLockClosed size={18} />} required />
              <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }} error={errors.confirmPassword} icon={<HiOutlineLockClosed size={18} />} required />
              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>Reset Password</Button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password? <Link to="/login" className="text-violet font-medium">Sign in</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
