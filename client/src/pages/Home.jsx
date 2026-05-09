import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineTruck, HiOutlineCreditCard } from 'react-icons/hi';
import Button from '../components/common/Button';
import ProductGrid from '../components/product/ProductGrid';
import { fetchFeatured } from '../redux/slices/productSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { featured, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeatured());
  }, [dispatch]);

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  const categories = [
    { name: 'Electronics', emoji: '📱', color: 'from-violet/20 to-violet/5' },
    { name: 'Fashion', emoji: '👗', color: 'from-cyan/20 to-cyan/5' },
    { name: 'Home & Living', emoji: '🏠', color: 'from-coral/20 to-coral/5' },
    { name: 'Sports', emoji: '⚽', color: 'from-green-500/20 to-green-500/5' },
    { name: 'Books', emoji: '📚', color: 'from-yellow-500/20 to-yellow-500/5' },
    { name: 'Beauty', emoji: '💄', color: 'from-pink-500/20 to-pink-500/5' },
  ];

  const trustBadges = [
    { icon: HiOutlineShieldCheck, label: 'Secure Payments', desc: '256-bit SSL encryption' },
    { icon: HiOutlineTruck, label: 'Free Shipping', desc: 'On orders above ₹499' },
    { icon: HiOutlineCreditCard, label: 'Easy Returns', desc: '30-day return policy' },
    { icon: HiOutlineSparkles, label: 'AI Assistant', desc: 'Smart shopping help' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Animated gradient bg */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-violet/10 via-navy to-cyan/5" />
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-violet/15 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-cyan/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-coral/5 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}>
            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-violet/20 text-sm text-violet mb-8">
              <HiOutlineSparkles className="text-cyan" />
              AI-Powered Shopping Experience
              <HiOutlineArrowRight size={14} />
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={fadeUp} className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Shop Smarter
              <br />
              <span className="gradient-text">with NexMart</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={fadeUp} className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover premium products with our AI assistant. Just tell it what you need — it finds, compares, and orders for you.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/products">
                <Button variant="primary" size="lg" icon={<HiOutlineArrowRight />}>
                  Start Shopping
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg">
                  Create Account
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-8 sm:gap-16 mt-16">
              {[['50K+', 'Products'], ['10K+', 'Happy Customers'], ['4.9★', 'App Rating']].map(([val, lbl]) => (
                <div key={lbl} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{val}</div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">{lbl}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-3xl font-bold text-white text-center mb-4">Shop by Category</h2>
          <p className="text-gray-500 text-center mb-12">Browse our curated collections</p>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to={`/products?category=${cat.name.toLowerCase()}`} className={`block glass rounded-2xl p-6 text-center hover:scale-105 hover:shadow-glow transition-all duration-300 group bg-gradient-to-br ${cat.color}`}>
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.emoji}</div>
                <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{cat.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="font-heading text-3xl font-bold text-white mb-2">Trending Now</h2>
            <p className="text-gray-500">Discover our most popular products</p>
          </div>
          <Link to="/products?sort=-ratings.average">
            <Button variant="outline" className="hidden sm:flex" icon={<HiOutlineArrowRight />}>View All</Button>
          </Link>
        </div>
        <ProductGrid products={featured} loading={loading} viewMode="grid" />
        <Link to="/products?sort=-ratings.average" className="sm:hidden mt-8 block">
          <Button variant="outline" fullWidth icon={<HiOutlineArrowRight />}>View All</Button>
        </Link>
      </section>

      {/* Trust Badges */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBadges.map((badge, i) => (
            <motion.div key={badge.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 text-center hover:shadow-glow transition-all duration-300">
              <badge.icon className="w-8 h-8 text-violet mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-1">{badge.label}</h3>
              <p className="text-gray-500 text-sm">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-violet/30 via-violet/10 to-cyan/20" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/20 rounded-full blur-3xl" />
          <div className="relative z-10 p-8 sm:p-16 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">Ready to experience AI shopping?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">Our AI assistant can find products, compare options, apply coupons, and place orders — all through a simple conversation.</p>
            <Link to="/register"><Button variant="primary" size="lg">Get Started Free</Button></Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
