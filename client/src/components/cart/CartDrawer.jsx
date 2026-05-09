import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { HiX, HiOutlineTrash, HiOutlineShoppingCart } from 'react-icons/hi';
import { toggleCartDrawer, removeFromCart, addToCart } from '../../redux/slices/cartSlice';
import Button from '../common/Button';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { cartItems, isDrawerOpen } = useSelector((state) => state.cart);

  // Close drawer on route change
  useEffect(() => {
    if (isDrawerOpen) {
      dispatch(toggleCartDrawer(false));
    }
  }, [location.pathname, dispatch]);

  const updateQuantity = (item, qty) => {
    if (qty > 0 && qty <= item.stock) {
      dispatch(addToCart({ ...item, qty }));
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={() => dispatch(toggleCartDrawer(false))}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] glass-strong shadow-glass z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="flex items-center gap-2 text-xl font-heading font-semibold text-white">
                <HiOutlineShoppingCart className="text-violet" />
                Your Cart ({cartItems.length})
              </h2>
              <button
                onClick={() => dispatch(toggleCartDrawer(false))}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <HiX size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-white font-medium">Your cart is empty</p>
                  <p className="text-sm text-gray-400 mt-2">Looks like you haven't added anything yet.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.variantSku} className="flex gap-4 group">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <Link to={`/product/${item.slug || item.product}`} className="font-medium text-white line-clamp-2 hover:text-violet transition-colors text-sm">
                            {item.name}
                          </Link>
                          <button
                            onClick={() => dispatch(removeFromCart(item))}
                            className="text-gray-500 hover:text-coral transition-colors p-1"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.color} {item.size ? `| ${item.size}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-cyan">₹{item.price.toLocaleString()}</span>
                        
                        {/* Qty Controls */}
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item, item.qty - 1)}
                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-50"
                            disabled={item.qty <= 1}
                          >-</button>
                          <span className="text-xs font-medium text-white w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQuantity(item, item.qty + 1)}
                            className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-50"
                            disabled={item.qty >= item.stock}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-navy/50 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-xl font-bold text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">Shipping & taxes calculated at checkout.</p>
                <div className="flex gap-3">
                  <Link to="/cart" className="flex-1" onClick={() => dispatch(toggleCartDrawer(false))}>
                    <Button variant="outline" fullWidth>View Cart</Button>
                  </Link>
                  <Link to="/checkout" className="flex-1" onClick={() => dispatch(toggleCartDrawer(false))}>
                    <Button variant="primary" fullWidth className="shadow-glow">Checkout</Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
