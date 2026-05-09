import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft, HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineReceiptTax, HiOutlineDownload } from 'react-icons/hi';
import { getOrderDetails } from '../redux/slices/orderSlice';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  if (loading || !order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet/30 border-t-violet rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-coral">{error}</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'text-yellow-500';
      case 'Packed': return 'text-blue-400';
      case 'Shipped': return 'text-purple-400';
      case 'Out for Delivery': return 'text-cyan';
      case 'Delivered': return 'text-green-500';
      case 'Cancelled': return 'text-coral';
      default: return 'text-gray-400';
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`/orders/${order._id}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order._id.toString().slice(-8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
        <HiOutlineArrowLeft /> Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-2">Order #{order._id}</h1>
          <p className="text-gray-400">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-4">
          <div>
            <span className="text-sm text-gray-500 block mb-1">Current Status</span>
            <span className={`font-bold ${getStatusColor(order.status)}`}>{order.status}</span>
          </div>
          {order.isPaid && (
            <div className="border-l border-white/10 pl-4">
              <Button variant="outline" size="sm" icon={<HiOutlineDownload />} onClick={handleDownloadInvoice}>
                Invoice
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Items */}
          <div className="glass rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-6">Items Ordered</h2>
            <div className="divide-y divide-white/5">
              {order.orderItems.map((item) => (
                <div key={item._id} className="py-4 flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link to={`/product/${item.product}`} className="font-medium text-white hover:text-violet transition-colors line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-400 mt-1">
                      {item.color} {item.size ? `| ${item.size}` : ''}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">Qty: {item.qty}</span>
                      <span className="font-medium text-cyan">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline (Simplified) */}
          <div className="glass rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-6">Order Timeline</h2>
            <div className="relative pl-6 border-l-2 border-white/10 space-y-8">
              <div className="relative">
                <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-violet" />
                <p className="font-medium text-white">Order Placed</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              {order.isPaid && (
                <div className="relative">
                  <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-cyan" />
                  <p className="font-medium text-white">Payment Confirmed</p>
                  <p className="text-sm text-gray-500">{new Date(order.paidAt).toLocaleString()}</p>
                </div>
              )}
              {order.isDelivered && (
                <div className="relative">
                  <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-green-500 shadow-glow" />
                  <p className="font-medium text-white">Delivered</p>
                  <p className="text-sm text-gray-500">{new Date(order.deliveredAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 text-white font-medium mb-4">
              <HiOutlineReceiptTax className="text-violet" /> Order Summary
            </h3>
            <div className="space-y-3 text-sm text-gray-400 mb-4 pb-4 border-b border-white/10">
              <div className="flex justify-between">
                <span>Items Price</span>
                <span className="text-white">₹{order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white">₹{order.shippingPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-white">₹{order.taxPrice.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-white">Total</span>
              <span className="text-xl font-bold text-cyan">₹{order.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 text-white font-medium mb-4">
              <HiOutlineLocationMarker className="text-violet" /> Shipping Address
            </h3>
            <div className="text-sm text-gray-400 space-y-1">
              <p className="text-white font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="pt-2 mt-2 border-t border-white/5">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="flex items-center gap-2 text-white font-medium mb-4">
              <HiOutlineCreditCard className="text-violet" /> Payment Info
            </h3>
            <div className="text-sm text-gray-400">
              <p>Method: <span className="text-white">{order.paymentMethod}</span></p>
              <p className="mt-2">Status: 
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${order.isPaid ? 'bg-green-500/10 text-green-500' : 'bg-coral/10 text-coral'}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
