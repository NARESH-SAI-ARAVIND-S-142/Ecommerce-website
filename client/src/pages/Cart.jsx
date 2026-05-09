import { useSelector, useDispatch } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineTrash, HiOutlineArrowRight, HiOutlineShieldCheck } from 'react-icons/hi';
import { removeFromCart, addToCart } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';
import CouponField from '../components/cart/CouponField';

const Cart = () => {
  const { cartItems, discountAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateQuantity = (item, qty) => {
    if (qty > 0 && qty <= item.stock) {
      dispatch(addToCart({ ...item, qty }));
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center mb-8 shadow-glow">
          <span className="text-8xl">🛒</span>
        </div>
        <h1 className="font-heading text-3xl font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Looks like you haven't added anything to your cart yet. Discover our premium collection and find something you love.
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg" icon={<HiOutlineArrowRight />}>
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-3xl font-bold text-white mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-white/10 text-sm font-medium text-gray-400">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-white/5">
              {cartItems.map((item) => (
                <div key={item.variantSku} className="py-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <Link to={`/product/${item.slug || item.product}`} className="font-heading font-semibold text-white hover:text-violet transition-colors text-lg line-clamp-2">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider">{item.brand}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.color} {item.size ? `| ${item.size}` : ''}
                      </p>
                      <button
                        onClick={() => dispatch(removeFromCart(item))}
                        className="text-sm text-coral hover:text-red-400 flex items-center gap-1 mt-3 transition-colors sm:hidden"
                      >
                        <HiOutlineTrash /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Price (Desktop) */}
                  <div className="col-span-2 text-center hidden sm:block text-gray-300">
                    ₹{item.price.toLocaleString()}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex justify-center w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-full sm:w-auto justify-between">
                      <button
                        onClick={() => updateQuantity(item, item.qty - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-50"
                        disabled={item.qty <= 1}
                      >-</button>
                      <span className="text-sm font-medium text-white text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item, item.qty + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-50"
                        disabled={item.qty >= item.stock}
                      >+</button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="col-span-2 flex items-center justify-between sm:justify-end w-full sm:w-auto mt-4 sm:mt-0">
                    <span className="text-lg font-bold text-cyan block sm:hidden">Total: </span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-cyan">₹{(item.price * item.qty).toLocaleString()}</span>
                      <button
                        onClick={() => dispatch(removeFromCart(item))}
                        className="text-sm text-gray-500 hover:text-coral flex items-center justify-end gap-1 mt-2 transition-colors hidden sm:flex ml-auto"
                      >
                        <HiOutlineTrash /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="glass-strong rounded-2xl p-6 sticky top-24">
            <h2 className="font-heading text-xl font-semibold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm text-gray-400 mb-6 pb-6 border-b border-white/10">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                <span className="text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-400 font-medium">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Estimate</span>
                <span className="text-white">{subtotal > 499 ? 'Free' : 'Calculated at checkout'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg text-white font-medium">Estimated Total</span>
              <span className="text-2xl font-bold gradient-text">₹{Math.max(0, subtotal - discountAmount).toLocaleString()}</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="shadow-glow"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
            
            <CouponField />

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
              <HiOutlineShieldCheck size={16} /> Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
