import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { createPaymentIntent, createOrder, resetOrderState } from '../redux/slices/orderSlice';
import { saveShippingAddress, clearCartItems } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

// Make sure to load stripe outside of a component to avoid recreating the object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock');

const CheckoutForm = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Avoid redirect to handle success state locally
    });

    if (error) {
      toast.error(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent);
    } else {
      toast.error('Unexpected payment status');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement className="stripe-theme-dark" />
      <Button type="submit" variant="primary" fullWidth size="lg" loading={isProcessing} disabled={!stripe}>
        Pay Now
      </Button>
    </form>
  );
};

const Checkout = () => {
  const { cartItems, shippingAddress } = useSelector((state) => state.cart);
  const { clientSecret, breakdown, loading, success, order } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [addressFormData, setAddressFormData] = useState({
    fullName: shippingAddress?.fullName || user?.name || '',
    phone: shippingAddress?.phone || '',
    street: shippingAddress?.street || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || '',
    pincode: shippingAddress?.pincode || '',
    country: shippingAddress?.country || 'India',
  });

  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/cart');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (success && order) {
      dispatch(clearCartItems());
      toast.success('Order placed successfully!');
      navigate(`/order-success/${order._id}`);
      dispatch(resetOrderState());
    }
  }, [success, order, dispatch, navigate]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(addressFormData));
    dispatch(createPaymentIntent(cartItems));
    setStep(2);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    // When payment succeeds, create the actual order in DB
    const orderData = {
      orderItems: cartItems,
      shippingAddress,
      paymentMethod: 'Card',
      itemsPrice: breakdown.itemsPrice,
      taxPrice: breakdown.taxPrice,
      shippingPrice: breakdown.shippingPrice,
      totalPrice: breakdown.totalPrice,
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
      },
    };
    dispatch(createOrder(orderData));
  };

  // Mock Stripe options. In dev/test without real keys, we might need a fallback.
  // We handle it gracefully via UI below if clientSecret is missing.
  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#8B5CF6',
      colorBackground: 'rgba(255, 255, 255, 0.05)',
      colorText: '#f1f5f9',
      colorDanger: '#ff6b6b',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '12px',
      gridRowSpacing: '16px',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Progress */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-white/10 -z-10 -translate-y-1/2" />
          <div className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-violet to-cyan -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: step === 2 ? '100%' : '50%' }} />
          
          <div className={`flex flex-col items-center gap-2 transition-colors ${step >= 1 ? 'text-white' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-violet text-white shadow-glow' : 'bg-navy border border-white/20'}`}>
              <HiOutlineLocationMarker size={20} />
            </div>
            <span className="text-sm font-medium">Shipping</span>
          </div>

          <div className={`flex flex-col items-center gap-2 transition-colors ${step >= 2 ? 'text-white' : 'text-gray-500'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-cyan text-navy shadow-[0_0_20px_rgba(0,201,167,0.4)]' : 'bg-navy border border-white/20'}`}>
              <HiOutlineCreditCard size={20} />
            </div>
            <span className="text-sm font-medium">Payment</span>
          </div>

          <div className="flex flex-col items-center gap-2 text-gray-500">
            <div className="w-10 h-10 rounded-full bg-navy border border-white/20 flex items-center justify-center">
              <HiOutlineCheck size={20} />
            </div>
            <span className="text-sm font-medium">Success</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass rounded-2xl p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-semibold text-white mb-6">Shipping Details</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" value={addressFormData.fullName} onChange={(e) => setAddressFormData({ ...addressFormData, fullName: e.target.value })} required />
                    <Input label="Phone Number" value={addressFormData.phone} onChange={(e) => setAddressFormData({ ...addressFormData, phone: e.target.value })} required />
                  </div>
                  <Input label="Street Address" value={addressFormData.street} onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })} required />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <Input label="City" value={addressFormData.city} onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })} required />
                    <Input label="State" value={addressFormData.state} onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })} required />
                    <Input label="PIN Code" value={addressFormData.pincode} onChange={(e) => setAddressFormData({ ...addressFormData, pincode: e.target.value })} required className="col-span-2 sm:col-span-1" />
                  </div>
                  <div className="pt-6 border-t border-white/5 mt-6">
                    <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto sm:ml-auto block shadow-glow">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass rounded-2xl p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-semibold text-white mb-6">Payment</h2>
                
                {loading && !clientSecret && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-10 h-10 border-4 border-cyan/30 border-t-cyan rounded-full animate-spin mb-4" />
                    <p className="text-gray-400">Initializing secure gateway...</p>
                  </div>
                )}

                {!loading && !clientSecret && (
                  <div className="bg-coral/10 border border-coral/20 rounded-xl p-6 text-center">
                    <p className="text-coral mb-4">Stripe keys are not configured. Payment mock available for development.</p>
                    <Button variant="primary" onClick={() => handlePaymentSuccess({ id: 'mock_intent_123', status: 'succeeded' })}>
                      Simulate Successful Payment
                    </Button>
                  </div>
                )}

                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                    <CheckoutForm clientSecret={clientSecret} onPaymentSuccess={handlePaymentSuccess} />
                  </Elements>
                )}

                <div className="mt-8 pt-6 border-t border-white/5">
                  <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    ← Back to Shipping
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-[400px]">
          <div className="glass-strong rounded-2xl p-6 sticky top-24">
            <h2 className="font-heading text-xl font-semibold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto no-scrollbar pr-2">
              {cartItems.map((item) => (
                <div key={item.variantSku} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover bg-white/5 border border-white/10" />
                  <div className="flex-1">
                    <p className="text-sm text-white line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
                    <p className="text-sm font-medium text-cyan mt-1">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-gray-400 py-4 border-y border-white/10 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">₹{breakdown ? breakdown.itemsPrice.toLocaleString() : cartItems.reduce((a, c) => a + c.price * c.qty, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">{breakdown ? (breakdown.shippingPrice === 0 ? 'Free' : `₹${breakdown.shippingPrice}`) : 'Calculated next step'}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (GST)</span>
                <span className="text-white">{breakdown ? `₹${breakdown.taxPrice.toLocaleString()}` : 'Calculated next step'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg text-white font-medium">Total</span>
              <span className="text-2xl font-bold gradient-text">
                ₹{breakdown ? breakdown.totalPrice.toLocaleString() : cartItems.reduce((a, c) => a + c.price * c.qty, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
