import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (query = '', { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products${query}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchMoreProducts = createAsyncThunk(
  'products/fetchMore',
  async (query = '', { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products${query}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${idOrSlug}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
    }
  }
);

export const fetchFeatured = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products/featured');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured products');
    }
  }
);

export const fetchRelated = createAsyncThunk(
  'products/fetchRelated',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}/related`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch related products');
    }
  }
);

const initialState = {
  items: [],
  featured: [],
  related: [],
  currentProduct: null,
  total: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  loadingMore: false,
  loadingDetails: false,
  error: null,
  filters: {
    keyword: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset pagination when filters change
      state.currentPage = 1;
      state.items = [];
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
      state.items = [];
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all products (initial load or filter change)
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch more products (infinite scroll)
    builder
      .addCase(fetchMoreProducts.pending, (state) => {
        state.loadingMore = true;
        state.error = null;
      })
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        state.loadingMore = false;
        // Append new products
        state.items = [...state.items, ...action.payload.products];
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchMoreProducts.rejected, (state, action) => {
        state.loadingMore = false;
        state.error = action.payload;
      });

    // Fetch details
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loadingDetails = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.currentProduct = action.payload.product;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.error = action.payload;
      });

    // Fetch featured
    builder.addCase(fetchFeatured.fulfilled, (state, action) => {
      state.featured = action.payload.products;
    });

    // Fetch related
    builder.addCase(fetchRelated.fulfilled, (state, action) => {
      state.related = action.payload.products;
    });
  },
});

export const { setFilter, clearFilters, setPage, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
