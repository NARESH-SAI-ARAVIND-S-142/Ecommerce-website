import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineCheckBadge } from 'react-icons/hi2';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';
import StarRating from './StarRating';

const ReviewSection = ({ productId }) => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/${productId}`);
      setReviews(data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.error('Please provide a rating and comment');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/reviews', { product: productId, rating, title, comment });
      toast.success('Review submitted successfully!');
      setShowForm(false);
      setRating(5);
      setTitle('');
      setComment('');
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="animate-pulse h-32 bg-white/5 rounded-xl mt-12"></div>;

  return (
    <div className="mt-16 border-t border-white/5 pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-heading text-2xl font-bold text-white flex items-center gap-3">
          <HiOutlineChatAlt2 className="text-violet" /> Customer Reviews
        </h2>
        {user && !showForm && (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12"
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white mb-6">Leave Your Review</h3>
              
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Overall Rating *</p>
                <StarRating rating={rating} setRating={setRating} interactive size="lg" />
              </div>

              <div className="space-y-4">
                <Input
                  label="Review Title"
                  placeholder="e.g., Exactly what I was looking for!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Your Review *
                  </label>
                  <textarea
                    className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition-colors resize-none"
                    rows={4}
                    placeholder="Tell others what you think about this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)} type="button">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={submitting}>
                  Submit Review
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="glass rounded-2xl p-6 border border-white/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold">
                    {review.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-white flex items-center gap-2">
                      {review.user?.name}
                      {review.isVerifiedPurchase && (
                        <span className="text-cyan text-xs flex items-center gap-1 bg-cyan/10 px-2 py-0.5 rounded-full border border-cyan/20">
                          <HiOutlineCheckBadge /> Verified
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              
              {review.title && <h4 className="font-semibold text-white mb-2">{review.title}</h4>}
              <p className="text-gray-400 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
