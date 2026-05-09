import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineArrowRight } from 'react-icons/hi';
import { getMyOrders } from '../redux/slices/orderSlice';
import Button from '../components/common/Button';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Packed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Shipped': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Out for Delivery': return 'bg-cyan/10 text-cyan border-cyan/20';
      case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Cancelled': return 'bg-coral/10 text-coral border-coral/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet/30 border-t-violet rounded-full animate-spin" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center mb-8 shadow-glow">
          <HiOutlineShoppingBag size={80} className="text-gray-600" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-white mb-4">No Orders Yet</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          You haven't placed any orders yet. Start exploring our premium collection!
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
      <h1 className="font-heading text-3xl font-bold text-white mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order, idx) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Order placed <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Total <span className="text-cyan font-bold">₹{order.totalPrice.toLocaleString()}</span>
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span className="text-xs text-gray-500">Order ID: {order._id}</span>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="w-24 flex-shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 mb-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
              {/* If more than 5 items, show count */}
              {order.orderItems.length > 5 && (
                <div className="w-24 h-24 rounded-xl bg-white/5 flex items-center justify-center text-sm font-medium text-gray-400 flex-shrink-0">
                  +{order.orderItems.length - 5} more
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
              <Link to={`/orders/${order._id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
