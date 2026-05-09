import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineTrash, HiOutlineShoppingCart, HiOutlineArrowRight } from 'react-icons/hi';
import { fetchWishlist, toggleWishlist } from '../redux/slices/wishlistSlice';
import { addToCart, toggleCartDrawer } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(toggleWishlist(id));
    toast.success('Removed from wishlist');
  };

  const handleMoveToCart = (product) => {
    const defaultVariant = product.variants[0];
    if (defaultVariant && defaultVariant.stock > 0) {
      dispatch(addToCart({
        product: product._id,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category: product.category,
        price: defaultVariant.price,
        image: defaultVariant.images?.[0]?.url,
        variantSku: defaultVariant.sku,
        color: defaultVariant.color,
        size: defaultVariant.size,
        stock: defaultVariant.stock,
        qty: 1,
      }));
      dispatch(toggleWishlist(product._id)); // Remove from wishlist
      dispatch(toggleCartDrawer());
    } else {
      toast.error('Product is currently out of stock');
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet/30 border-t-violet rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center mb-8 shadow-glow">
          <HiOutlineHeart size={80} className="text-gray-600" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-white mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Save items you love here and purchase them later. Start exploring our collection now!
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg" icon={<HiOutlineArrowRight />}>
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-heading text-3xl font-bold text-white mb-8 flex items-center gap-3">
        <HiOutlineHeart className="text-coral" /> My Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product, idx) => {
          const variant = product.variants?.[0] || {};
          const image = variant.images?.[0]?.url;
          const inStock = variant.stock > 0;

          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass rounded-2xl p-4 flex flex-col relative group"
            >
              <button 
                onClick={() => handleRemove(product._id)}
                className="absolute top-6 right-6 z-10 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-coral transition-colors opacity-0 group-hover:opacity-100"
                title="Remove"
              >
                <HiOutlineTrash size={16} />
              </button>

              <Link to={`/product/${product.slug}`} className="block relative aspect-square rounded-xl overflow-hidden bg-white/5 mb-4">
                {image && <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                {!inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
                  </div>
                )}
              </Link>

              <div className="flex-1 flex flex-col">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
                <Link to={`/product/${product.slug}`} className="font-heading font-medium text-white hover:text-violet transition-colors line-clamp-2 mb-2 flex-1">
                  {product.name}
                </Link>
                <div className="flex items-center justify-between mt-auto pt-4">
                  <span className="font-bold text-cyan text-lg">₹{variant.price?.toLocaleString()}</span>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    icon={<HiOutlineShoppingCart />}
                    disabled={!inStock}
                    onClick={() => handleMoveToCart(product)}
                  >
                    Move to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
