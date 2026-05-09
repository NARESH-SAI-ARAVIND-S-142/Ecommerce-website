import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineClipboardList,
} from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCartDrawer } from '../../redux/slices/cartSlice';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Track scroll for glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Shop' },
    { path: '/products?category=electronics', label: 'Electronics' },
    { path: '/products?category=fashion', label: 'Fashion' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-strong shadow-glass py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet to-cyan flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-white font-heading font-bold text-sm">N</span>
              </div>
              <span className="font-heading font-bold text-xl gradient-text hidden sm:block">
                NexMart
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-violet bg-violet/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Search"
              >
                <HiOutlineSearch size={20} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all hidden sm:flex"
                aria-label="Wishlist"
              >
                <HiOutlineHeart size={20} />
              </Link>

              {/* Cart */}
              <button
                onClick={() => dispatch(toggleCartDrawer())}
                className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Shopping cart"
              >
                <HiOutlineShoppingCart size={20} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0 right-0 -mt-1 -mr-1 bg-coral text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-navy"
                    >
                      {cartCount}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center">
                      {user?.avatar?.url ? (
                        <img
                          src={user.avatar.url}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-sm font-semibold">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 glass-strong rounded-xl shadow-glass overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-sm font-medium text-white truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <HiOutlineUser size={16} />
                            My Profile
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <HiOutlineClipboardList size={16} />
                            My Orders
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                          >
                            <HiOutlineHeart size={16} />
                            Wishlist
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-cyan hover:bg-cyan/5 transition-all"
                            >
                              <HiOutlineCog size={16} />
                              Admin Dashboard
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-white/5 py-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-coral hover:bg-coral/5 transition-all"
                          >
                            <HiOutlineLogout size={16} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-violet to-violet-600 text-white hover:shadow-glow transition-all duration-300"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <HiOutlineX size={20} />
                ) : (
                  <HiOutlineMenu size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search products, brands, categories..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-violet/50 focus:bg-violet/5 transition-all"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-72 glass-strong shadow-glass pt-20 px-4 md:hidden"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'text-violet bg-violet/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-violet to-violet-600 text-center mt-4"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
