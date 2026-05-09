import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineFilter, HiX, HiChevronDown } from 'react-icons/hi';
import Button from '../common/Button';

const FilterPanel = ({ filters, onFilterChange, isOpen, onClose }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({ categories: true, price: true });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Beauty'];

  const handleApply = () => {
    onFilterChange(localFilters);
    if (window.innerWidth < 1024) onClose();
  };

  const handleClear = () => {
    const cleared = { ...localFilters, category: '', minPrice: '', maxPrice: '' };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  const toggleSection = (section) => {
    setExpandedSections((p) => ({ ...p, [section]: !p[section] }));
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="border-b border-white/5 pb-6">
        <button className="flex items-center justify-between w-full text-white font-medium mb-4" onClick={() => toggleSection('categories')}>
          Categories
          <HiChevronDown className={`transition-transform ${expandedSections.categories ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSections.categories && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
              {categories.map((cat) => {
                const value = cat.toLowerCase();
                const isSelected = localFilters.category === value;
                return (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-violet border-violet' : 'border-white/20 bg-white/5 group-hover:border-violet/50'}`}>
                      {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <input type="checkbox" className="hidden" checked={isSelected} onChange={() => setLocalFilters({ ...localFilters, category: isSelected ? '' : value })} />
                    <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-300'}`}>{cat}</span>
                  </label>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range */}
      <div className="border-b border-white/5 pb-6">
        <button className="flex items-center justify-between w-full text-white font-medium mb-4" onClick={() => toggleSection('price')}>
          Price Range
          <HiChevronDown className={`transition-transform ${expandedSections.price ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input type="number" placeholder="Min" className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-violet/50" value={localFilters.minPrice} onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })} />
                </div>
                <span className="text-gray-500">-</span>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
                  <input type="number" placeholder="Max" className="w-full bg-white/5 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-violet/50" value={localFilters.maxPrice} onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={handleClear}>Clear</Button>
        <Button variant="primary" className="flex-1" onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );

  // Mobile Drawer
  if (window.innerWidth < 1024) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 left-0 w-80 glass-strong shadow-glass z-50 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <h2 className="flex items-center gap-2 text-lg font-heading font-semibold text-white">
                  <HiOutlineFilter className="text-violet" /> Filters
                </h2>
                <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"><HiX size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6"><FilterContent /></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Sidebar
  return (
    <div className="w-64 flex-shrink-0">
      <div className="glass rounded-2xl p-6 sticky top-24">
        <h2 className="flex items-center gap-2 text-lg font-heading font-semibold text-white mb-6 border-b border-white/5 pb-4">
          <HiOutlineFilter className="text-violet" /> Filters
        </h2>
        <FilterContent />
      </div>
    </div>
  );
};

export default FilterPanel;
