import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import { SkeletonCard } from '../common/Skeleton';

const ProductGrid = ({ products, loading, viewMode = 'grid', emptyMessage = 'No products found' }) => {
  if (loading && products.length === 0) {
    return (
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-4'}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} className={viewMode === 'list' ? 'h-48' : ''} />
        ))}
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-xl font-heading font-semibold text-white mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">Try adjusting your search or filters.</p>
      </motion.div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-4'}>
      <AnimatePresence>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} viewMode={viewMode} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;
