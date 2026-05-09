import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineTicket, HiOutlineX } from 'react-icons/hi';
import { applyCoupon, removeCoupon } from '../../redux/slices/cartSlice';
import Button from '../common/Button';

const CouponField = () => {
  const [code, setCode] = useState('');
  const dispatch = useDispatch();
  const { coupon, loadingCoupon, couponError } = useSelector((state) => state.cart);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      dispatch(applyCoupon(code.trim()));
    }
  };

  const handleRemove = () => {
    setCode('');
    dispatch(removeCoupon());
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-6">
      <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
        <HiOutlineTicket className="text-violet" /> Apply Coupon
      </h3>
      
      {coupon ? (
        <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
          <div>
            <p className="text-sm font-bold text-green-400">{coupon.code}</p>
            <p className="text-xs text-green-500/70">
              {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`} applied
            </p>
          </div>
          <button 
            onClick={handleRemove}
            className="text-gray-400 hover:text-coral transition-colors"
          >
            <HiOutlineX size={16} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet transition-colors uppercase"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button 
            type="submit" 
            variant="outline" 
            size="sm" 
            disabled={!code.trim() || loadingCoupon}
            loading={loadingCoupon}
          >
            Apply
          </Button>
        </form>
      )}
      
      {couponError && (
        <p className="text-xs text-coral mt-2">{couponError}</p>
      )}
    </div>
  );
};

export default CouponField;
