import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', orderData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  'order/createPaymentIntent',
  async (items, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders/create-payment-intent', { items });
      return data; // { clientSecret, breakdown }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment intent');
    }
  }
);

export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders/myorders');
      return data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    orders: [], // Added for my orders
    clientSecret: null,
    breakdown: null,
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.success = false;
      state.error = null;
      state.clientSecret = null;
      state.breakdown = null;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Payment Intent
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
        state.breakdown = action.payload.breakdown;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get My Orders
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Order Details
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
