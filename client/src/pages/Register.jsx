import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const { register, isAuthenticated, loading, error, resetError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthenticated) navigate('/', { replace: true }); }, [isAuthenticated, navigate]);
  useEffect(() => { if (error) { toast.error(error); resetError(); } }, [error, resetError]);

  const getStrength = (p) => {
    let s = 0;
    if (p.length >= 8) s++; if (p.length >= 12) s++;
    if (/[A-Z]/.test(p)) s++; if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const sLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const sColors = ['', 'bg-coral', 'bg-orange-400', 'bg-yellow-400', 'bg-cyan', 'bg-green-400'];
  const strength = getStrength(formData.password);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    if (!formData.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8) e.password = 'Min 8 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const { confirmPassword, ...data } = formData;
    const result = await register(data);
    if (result.meta?.requestStatus === 'fulfilled') toast.success('Welcome to NexMart! 🎉');
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }} className="w-full max-w-md">
          <motion.div variants={item} className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet to-cyan flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">N</span>
              </div>
              <span className="font-heading font-bold text-2xl gradient-text">NexMart</span>
            </Link>
            <h1 className="font-heading text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-gray-500 text-sm">Join 10,000+ shoppers</p>
          </motion.div>

          <motion.div variants={item}>
            <button onClick={() => toast('Google OAuth requires API keys', { icon: 'ℹ️' })} className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 text-sm font-medium hover:bg-white/[0.06] transition-all">
              <FcGoogle size={20} /> Sign up with Google
            </button>
          </motion.div>

          <motion.div variants={item} className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" /><span className="text-xs text-gray-600 uppercase">or</span><div className="flex-1 h-px bg-white/10" />
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={item}><Input label="Full Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} icon={<HiOutlineUser size={18} />} required /></motion.div>
            <motion.div variants={item}><Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} icon={<HiOutlineMail size={18} />} required /></motion.div>
            <motion.div variants={item}>
              <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} error={errors.password} icon={<HiOutlineLockClosed size={18} />} required />
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">{[1,2,3,4,5].map(l => <div key={l} className={`h-1 flex-1 rounded-full transition-all ${l <= strength ? sColors[strength] : 'bg-white/10'}`} />)}</div>
                  <p className="text-xs text-gray-400">{sLabels[strength]}</p>
                </div>
              )}
            </motion.div>
            <motion.div variants={item}><Input label="Confirm Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon={<HiOutlineLockClosed size={18} />} required /></motion.div>
            <motion.div variants={item}><Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>Create Account</Button></motion.div>
          </form>

          <motion.p variants={item} className="text-center text-sm text-gray-500 mt-6">Already have an account? <Link to="/login" className="text-violet font-medium">Sign in</Link></motion.p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-cyan/20 via-navy to-violet/10" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 -left-20 w-80 h-80 bg-violet/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-cyan/30 to-violet/20 backdrop-blur-xl border border-white/10 flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-500 mb-8">
            <div className="text-6xl">🤖</div>
          </div>
          <h2 className="font-heading text-3xl font-bold text-white text-center mb-4">AI-Powered Shopping</h2>
          <p className="text-gray-400 text-center max-w-sm">Our intelligent assistant helps you find, compare, and order — all through conversation.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
