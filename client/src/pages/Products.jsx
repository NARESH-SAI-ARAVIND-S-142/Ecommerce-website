import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineViewList, HiOutlineSortAscending } from 'react-icons/hi';
import { fetchProducts, fetchMoreProducts, setFilter, setPage } from '../redux/slices/productSlice';
import useDebounce from '../hooks/useDebounce';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import ProductGrid from '../components/product/ProductGrid';
import FilterPanel from '../components/product/FilterPanel';
import Button from '../components/common/Button';

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { items, total, totalPages, currentPage, loading, loadingMore, filters } = useSelector((state) => state.products);

  // Sync URL query params with Redux filters on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const keyword = params.get('keyword');
    const newFilters = {};
    if (category) newFilters.category = category;
    if (keyword) newFilters.keyword = keyword;
    
    if (Object.keys(newFilters).length > 0) {
      dispatch(setFilter(newFilters));
    }
  }, [location.search, dispatch]);

  const debouncedFilters = useDebounce(filters, 500);

  const buildQueryString = useCallback((filterState, page = 1) => {
    const params = new URLSearchParams();
    if (filterState.keyword) params.append('keyword', filterState.keyword);
    if (filterState.category) params.append('category', filterState.category);
    if (filterState.minPrice) params.append('minPrice', filterState.minPrice);
    if (filterState.maxPrice) params.append('maxPrice', filterState.maxPrice);
    if (filterState.sort) params.append('sort', filterState.sort);
    params.append('page', page);
    return `?${params.toString()}`;
  }, []);

  // Fetch initial products when debounced filters change
  useEffect(() => {
    const query = buildQueryString(debouncedFilters, 1);
    dispatch(fetchProducts(query));
    // Update URL without reload
    navigate(query, { replace: true });
  }, [debouncedFilters, dispatch, navigate, buildQueryString]);

  // Load more function for infinite scroll
  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      dispatch(setPage(nextPage));
      const query = buildQueryString(debouncedFilters, nextPage);
      dispatch(fetchMoreProducts(query));
    }
  }, [loading, loadingMore, currentPage, totalPages, dispatch, buildQueryString, debouncedFilters]);

  const hasMore = currentPage < totalPages;
  const lastElementRef = useInfiniteScroll(hasMore, loadingMore, handleLoadMore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-white mb-2">
            {filters.category ? <span className="capitalize">{filters.category}</span> : 'All Products'}
            {filters.keyword && <span> matching "{filters.keyword}"</span>}
          </h1>
          <p className="text-gray-400">Showing {items.length} of {total} products</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Filter Toggle */}
          <Button variant="outline" className="lg:hidden" onClick={() => setMobileFiltersOpen(true)}>
            Filters
          </Button>

          {/* Sort Select */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <HiOutlineSortAscending className="text-gray-400" size={20} />
            <select
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
              value={filters.sort}
              onChange={(e) => dispatch(setFilter({ sort: e.target.value }))}
            >
              <option value="-createdAt" className="bg-navy">Newest Arrivals</option>
              <option value="price" className="bg-navy">Price: Low to High</option>
              <option value="-price" className="bg-navy">Price: High to Low</option>
              <option value="-ratings.average" className="bg-navy">Top Rated</option>
            </select>
          </div>

          {/* View Toggles */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-violet text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <HiOutlineViewGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-violet text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <HiOutlineViewList size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <FilterPanel
          filters={filters}
          onFilterChange={(newFilters) => dispatch(setFilter(newFilters))}
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={items} loading={loading} viewMode={viewMode} />
          
          {/* Infinite Scroll trigger element */}
          <div ref={lastElementRef} className="h-10 mt-8 flex items-center justify-center">
            {loadingMore && <div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin" />}
            {!hasMore && items.length > 0 && <p className="text-sm text-gray-500">You've reached the end!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
