import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, loginWithGoogle, isAuthenticated, loading, error, resetError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      resetError();
    }
  }, [error, resetError]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login(formData);
    if (result.meta?.requestStatus === 'fulfilled') {
      toast.success('Welcome back! 🎉');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleGoogleLogin = async () => {
    toast('Google OAuth requires API keys to be configured', { icon: 'ℹ️' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet/20 via-navy to-cyan/10" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-violet/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          {/* Abstract shopping illustration */}
          <div className="relative mb-8">
            <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-violet/30 to-cyan/20 backdrop-blur-xl border border-white/10 flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-violet/20 to-transparent border border-white/10 flex items-center justify-center transform -rotate-12">
                <div className="text-center">
                  <div className="text-6xl mb-3">🛒</div>
                  <div className="w-16 h-1 bg-gradient-to-r from-violet to-cyan rounded-full mx-auto" />
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-cyan/20 border border-cyan/30 flex items-center justify-center animate-float text-lg">
              ✨
            </div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl bg-violet/20 border border-violet/30 flex items-center justify-center animate-float text-lg" style={{ animationDelay: '2s' }}>
              🎯
            </div>
          </div>

          <h2 className="font-heading text-3xl font-bold text-white text-center mb-4">
            Shop Smarter with AI
          </h2>
          <p className="text-gray-400 text-center max-w-sm leading-relaxed">
            Experience the future of shopping with our AI-powered assistant that
            understands exactly what you need.
          </p>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-xl font-bold gradient-text">50K+</div>
              <div className="text-xs text-gray-500">Products</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-xl font-bold gradient-text">10K+</div>
              <div className="text-xs text-gray-500">Users</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-xl font-bold gradient-text">4.9★</div>
              <div className="text-xs text-gray-500">Rating</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-cyan flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">N</span>
              </div>
              <span className="font-heading font-bold text-2xl gradient-text">NexMart</span>
            </Link>
            <h1 className="font-heading text-2xl font-bold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to continue your shopping journey
            </p>
          </motion.div>

          {/* Google OAuth */}
          <motion.div variants={itemVariants}>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 text-sm font-medium hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300"
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants}>
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={<HiOutlineMail size={18} />}
                placeholder="you@example.com"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<HiOutlineLockClosed size={18} />}
                placeholder="••••••••"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet focus:ring-violet/50 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-violet hover:text-violet-300 transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                Sign In
              </Button>
            </motion.div>
          </form>

          {/* Register Link */}
          <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-violet hover:text-violet-300 font-medium transition-colors"
            >
              Create one
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
