import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShoppingCart, HiOutlineHeart, HiStar } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import Button from '../common/Button';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const dispatch = useDispatch();
  const { slug, name, brand, category, variants, ratings } = product;

  // Derive display values from first variant
  const defaultVariant = variants?.[0] || {};
  const image = defaultVariant.images?.[0]?.url || 'https://via.placeholder.com/300x400?text=No+Image';
  const price = defaultVariant.price || 0;
  const comparePrice = defaultVariant.compareAtPrice;
  const inStock = defaultVariant.stock > 0;

  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (inStock) {
      dispatch(
        addToCart({
          product: product._id || product.id,
          name,
          slug,
          brand,
          category,
          price,
          image,
          variantSku: defaultVariant.sku,
          color: defaultVariant.color,
          size: defaultVariant.size,
          stock: defaultVariant.stock,
          qty: 1,
        })
      );
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    // To be implemented in Phase 3
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/product/${slug}`} className="block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 flex gap-6 hover:shadow-glow transition-all duration-300 group"
        >
          {/* Image */}
          <div className="relative w-48 h-48 flex-shrink-0 rounded-xl overflow-hidden bg-white/5">
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            {discount > 0 && (
              <span className="absolute top-2 left-2 bg-coral text-white text-xs font-bold px-2 py-1 rounded-md">
                -{discount}%
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between flex-1 py-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{brand}</span>
                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                  <HiStar className="text-yellow-400" size={14} />
                  <span className="text-xs font-medium text-white">{ratings?.average?.toFixed(1) || '0.0'}</span>
                  <span className="text-xs text-gray-500">({ratings?.count || 0})</span>
                </div>
              </div>
              <h3 className="font-heading font-semibold text-lg text-white mb-2 line-clamp-2 group-hover:text-violet transition-colors">
                {name}
              </h3>
              <p className="text-sm text-gray-400 mb-4 capitalize">{category}</p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                {comparePrice && (
                  <span className="text-sm text-gray-500 line-through mr-2">₹{comparePrice.toLocaleString()}</span>
                )}
                <span className="text-2xl font-bold gradient-text">₹{price.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={handleWishlist} className="p-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-coral hover:border-coral/50 hover:bg-coral/10 transition-all">
                  <HiOutlineHeart size={20} />
                </button>
                <Button variant="primary" size="sm" icon={<HiOutlineShoppingCart />} onClick={handleQuickAdd} disabled={!inStock}>
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${slug}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="tilt-card glass rounded-2xl overflow-hidden h-full flex flex-col group"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-coral text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-lg">
              -{discount}%
            </span>
          )}

          {/* Quick Actions (Hover) */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 px-4">
            <button onClick={handleWishlist} className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-coral hover:border-coral transition-colors shadow-lg">
              <HiOutlineHeart size={20} />
            </button>
            <Button variant="primary" className="flex-1 shadow-lg" onClick={handleQuickAdd} disabled={!inStock}>
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{brand}</span>
            <div className="flex items-center gap-1">
              <HiStar className="text-yellow-400" size={14} />
              <span className="text-xs font-medium text-gray-300">{ratings?.average?.toFixed(1) || '0.0'}</span>
            </div>
          </div>
          <h3 className="font-heading font-semibold text-white mb-1 line-clamp-2 group-hover:text-violet transition-colors flex-1">
            {name}
          </h3>
          <div className="mt-4 flex items-end justify-between">
            <div>
              {comparePrice && (
                <span className="text-xs text-gray-500 line-through block mb-0.5">₹{comparePrice.toLocaleString()}</span>
              )}
              <span className="text-lg font-bold text-cyan">₹{price.toLocaleString()}</span>
            </div>
            {!inStock && <span className="text-xs text-coral font-medium bg-coral/10 px-2 py-1 rounded-md">Out of Stock</span>}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
