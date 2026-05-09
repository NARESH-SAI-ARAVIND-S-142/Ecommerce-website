import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineUsers, HiOutlineClipboardList, HiOutlineCurrencyRupee } from 'react-icons/hi';
import { fetchAdminStats } from '../../redux/slices/adminSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet/30 border-t-violet rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: HiOutlineCurrencyRupee,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20'
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: HiOutlineClipboardList,
      color: 'text-cyan',
      bg: 'bg-cyan/10',
      border: 'border-cyan/20'
    },
    {
      title: 'Total Users',
      value: stats.users,
      icon: HiOutlineUsers,
      color: 'text-violet',
      bg: 'bg-violet/10',
      border: 'border-violet/20'
    }
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass rounded-2xl p-6 border ${card.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-2xl font-bold text-white">{card.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon size={24} className={card.color} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 glass rounded-2xl p-8 text-center border border-white/5">
        <h2 className="text-xl font-semibold text-white mb-2">Welcome to the NexMart Admin Panel</h2>
        <p className="text-gray-400">Use the sidebar to manage products, view user accounts, and process incoming orders.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
