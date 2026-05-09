import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineCheck, HiOutlineShoppingBag, HiOutlineArrowRight } from 'react-icons/hi';
import Button from '../components/common/Button';

const OrderSuccess = () => {
  const { id } = useParams();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan to-green-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,201,167,0.3)]"
        >
          <HiOutlineCheck size={48} className="text-navy" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-2"
        >
          Thank you for shopping with NexMart. Your order has been placed successfully and is being processed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-xl py-3 px-6 inline-block mb-10"
        >
          <span className="text-sm text-gray-500 mr-2">Order ID:</span>
          <span className="font-mono text-cyan font-medium">{id}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to={`/orders/${id}`}>
            <Button variant="outline" size="lg" icon={<HiOutlineShoppingBag />}>
              View Order Details
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="primary" size="lg" icon={<HiOutlineArrowRight />}>
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccess;
