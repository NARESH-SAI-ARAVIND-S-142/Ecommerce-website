import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/adminSlice';
import { HiOutlineExternalLink } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const isDelivered = newStatus === 'Delivered';
      await dispatch(updateOrderStatus({ orderId, status: newStatus, isDelivered })).unwrap();
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err || 'Failed to update order');
    }
  };

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

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet/30 border-t-violet rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-white mb-8">Manage Orders</h1>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-sm font-medium text-gray-400">
                <th className="p-4">Order ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-gray-300">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-xs">{o._id}</td>
                  <td className="p-4 font-medium text-white">{o.user?.name || 'Deleted User'}</td>
                  <td className="p-4 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-cyan font-bold">₹{o.totalPrice.toLocaleString()}</td>
                  <td className="p-4">
                    {o.isPaid ? (
                      <span className="text-green-500">Yes</span>
                    ) : (
                      <span className="text-coral">No</span>
                    )}
                  </td>
                  <td className="p-4">
                    <select
                      className={`bg-white/5 border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-violet cursor-pointer font-bold ${getStatusColor(o.status)}`}
                      value={o.status}
                      onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                    >
                      {['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
                        <option key={status} value={status} className="bg-navy text-white font-normal">{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/orders/${o._id}`} className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1">
                      <HiOutlineExternalLink /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
