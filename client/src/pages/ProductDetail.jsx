import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingCart, HiOutlineHeart, HiStar, HiOutlineCheck, HiOutlineTruck, HiOutlineShieldCheck } from 'react-icons/hi';
import { fetchProductDetails, clearCurrentProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Gallery from '../components/product/Gallery';
import ReviewSection from '../components/product/ReviewSection';
import Button from '../components/common/Button';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentProduct: product, loadingDetails } = useSelector((state) => state.products);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductDetails(slug));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, slug]);

  // Reset selected variant if product changes
  useEffect(() => {
    if (product?.variants) setSelectedVariant(0);
  }, [product]);

  if (loadingDetails) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet/30 border-t-violet rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const variant = product.variants[selectedVariant] || {};
  const inStock = variant.stock > 0;
  const discount = variant.compareAtPrice ? Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (inStock) {
      dispatch(
        addToCart({
          product: product._id || product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          category: product.category,
          price: variant.price,
          image: variant.images?.[0]?.url,
          variantSku: variant.sku,
          color: variant.color,
          size: variant.size,
          stock: variant.stock,
          qty: quantity,
        })
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Gallery */}
        <div className="lg:h-[600px] sticky top-24">
          <Gallery images={variant.images} />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-violet uppercase tracking-wider">{product.brand}</span>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center text-yellow-400">
                  <HiStar size={16} />
                  <span className="ml-1 font-medium text-white">{product.ratings?.average?.toFixed(1) || '0.0'}</span>
                </div>
                <span className="text-gray-500">({product.ratings?.count || 0} reviews)</span>
              </div>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              {product.name}
            </h1>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-4xl font-bold gradient-text">₹{variant.price?.toLocaleString()}</span>
              {variant.compareAtPrice && (
                <span className="text-lg text-gray-500 line-through mb-1">₹{variant.compareAtPrice.toLocaleString()}</span>
              )}
              {discount > 0 && (
                <span className="bg-coral/10 text-coral text-sm font-bold px-2 py-1 rounded-md mb-1">
                  {discount}% OFF
                </span>
              )}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{product.description}</p>
          </div>

          <div className="h-px bg-white/10 w-full my-6" />

          {/* Variants Selector */}
          {product.variants?.length > 1 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-white mb-3 flex items-center justify-between">
                <span>Select Variant</span>
                <span className="text-gray-400">{variant.color || variant.size || `Option ${selectedVariant + 1}`}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v, idx) => (
                  <button
                    key={v._id || idx}
                    onClick={() => setSelectedVariant(idx)}
                    className={`relative px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      idx === selectedVariant
                        ? 'border-violet bg-violet/10 text-white shadow-glow'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {v.color || v.size || `Option ${idx + 1}`}
                    {idx === selectedVariant && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan rounded-full border-2 border-navy" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Area */}
          <div className="glass-strong rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-coral animate-pulse'}`} />
                <span className={`text-sm font-medium ${inStock ? 'text-green-500' : 'text-coral'}`}>
                  {inStock ? `In Stock (${variant.stock} left)` : 'Out of Stock'}
                </span>
              </div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">SKU: {variant.sku}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-1 sm:w-32">
                <button
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!inStock}
                >-</button>
                <span className="text-white font-medium">{quantity}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  onClick={() => setQuantity(Math.min(variant.stock, quantity + 1))}
                  disabled={!inStock}
                >+</button>
              </div>

              {/* Add to Cart */}
              <Button
                variant="primary"
                size="lg"
                className="flex-1 shadow-glow"
                icon={<HiOutlineShoppingCart />}
                disabled={!inStock}
                onClick={handleAddToCart}
              >
                {inStock ? 'Add to Cart' : 'Notify Me'}
              </Button>
              
              {/* Wishlist */}
              <Button variant="outline" size="lg" className="px-4" icon={<HiOutlineHeart />} />
            </div>
          </div>

          {/* Features & Policies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
              <HiOutlineTruck className="text-violet mt-0.5" size={24} />
              <div>
                <h4 className="text-sm font-medium text-white">Free Delivery</h4>
                <p className="text-xs text-gray-400 mt-1">Enter PIN code for exact dates</p>
              </div>
            </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 p-4 rounded-xl bg-white/5 border border-white/10">
                <HiOutlineShieldCheck className="text-green-400" size={24} />
                <div>
                  <p className="font-medium text-white">2 Year Warranty</p>
                  <p className="text-xs">Guaranteed protection</p>
                </div>
              </div>
          </div>

          {/* Specs List */}
          {product.features?.length > 0 && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="font-heading font-semibold text-white mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <HiOutlineCheck className="text-cyan mt-1 flex-shrink-0" size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Review Section */}
      <ReviewSection productId={product._id || product.id} />
    </div>
  );
};

export default ProductDetail;
