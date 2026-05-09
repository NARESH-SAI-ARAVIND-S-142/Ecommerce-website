import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async (code, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/coupons/${code}`);
      return data.coupon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid coupon code');
    }
  }
);

// Helper to save to localStorage
const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem('nexmart_cart', JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save cart to localStorage', e);
  }
};

// Load initial state from localStorage
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('nexmart_cart');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const initialState = loadFromLocalStorage() || {
  cartItems: [],
  shippingAddress: null,
  paymentMethod: 'Card',
  isDrawerOpen: false,
  coupon: null,
  discountAmount: 0,
  loadingCoupon: false,
  couponError: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find(
        (x) => x.product === item.product && x.variantSku === item.variantSku
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product && x.variantSku === existItem.variantSku ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      
      saveToLocalStorage(state);
      state.isDrawerOpen = true; // Auto-open drawer when adding items
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => !(x.product === action.payload.product && x.variantSku === action.payload.variantSku)
      );
      saveToLocalStorage(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      saveToLocalStorage(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      saveToLocalStorage(state);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discountAmount = 0;
      state.couponError = null;
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.coupon = null;
      state.discountAmount = 0;
      localStorage.removeItem('nexmart_cart');
    },
    toggleCartDrawer: (state, action) => {
      state.isDrawerOpen = action.payload !== undefined ? action.payload : !state.isDrawerOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyCoupon.pending, (state) => {
        state.loadingCoupon = true;
        state.couponError = null;
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.loadingCoupon = false;
        state.coupon = action.payload;
        state.couponError = null;
        
        // Calculate discount based on subtotal
        const subtotal = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
        if (subtotal >= action.payload.minPurchase) {
          if (action.payload.discountType === 'percentage') {
            state.discountAmount = (subtotal * action.payload.discountValue) / 100;
          } else {
            state.discountAmount = action.payload.discountValue;
          }
        } else {
          state.couponError = `Minimum purchase of ₹${action.payload.minPurchase} required`;
          state.coupon = null;
          state.discountAmount = 0;
        }
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.loadingCoupon = false;
        state.couponError = action.payload;
        state.coupon = null;
        state.discountAmount = 0;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  removeCoupon,
  clearCartItems,
  toggleCartDrawer,
} = cartSlice.actions;

export default cartSlice.reducer;
