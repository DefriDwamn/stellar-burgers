import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../../utils/types';
import { getOrderByNumberApi, orderBurgerApi } from '../../utils/burger-api';

type TOrdersSliceState = {
  orderDetails: TOrder | null;
  loading: boolean;
  orderClaim: boolean;
  orderError: string | null;
  orderId: string | null;
};

export const initialState: TOrdersSliceState = {
  orderDetails: null,
  loading: false,
  orderClaim: false,
  orderError: null,
  orderId: null
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (data: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(data);
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to create order'
      );
    }
  }
);

export const retrieveOrderByNumber = createAsyncThunk(
  'order/retrieveById',
  async (data: number, { rejectWithValue }) => {
    try {
      return await getOrderByNumberApi(data);
    } catch (error) {
      return rejectWithValue(
        (error as Error).message || 'Failed to retrieve order'
      );
    }
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orderDetails = null;
      state.loading = false;
      state.orderClaim = false;
      state.orderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.orderClaim = true;
        state.orderError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orderDetails = action.payload.order;
        state.loading = false;
        state.orderClaim = false;
        state.orderError = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.orderClaim = false;
        state.loading = false;
        state.orderError =
          (action.payload as string) || 'Failed to create order';
      })
      .addCase(retrieveOrderByNumber.pending, (state) => {
        state.orderClaim = true;
        state.loading = true;
        state.orderError = null;
      })
      .addCase(retrieveOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderClaim = true;
        state.orderDetails = action.payload.orders[0];
        state.orderError = null;
      })
      .addCase(retrieveOrderByNumber.rejected, (state, action) => {
        state.orderClaim = false;
        state.loading = false;
        state.orderError =
          (action.payload as string) || 'Failed to retrieve order';
      });
  },
  selectors: {
    selectOrders: (state) => state.orderDetails,
    selectquery: (state) => state.orderClaim,
    selectOrderError: (state) => state.orderError
  }
});

export default ordersSlice.reducer;
export const { selectOrders, selectquery, selectOrderError } =
  ordersSlice.selectors;
export const { clearOrders } = ordersSlice.actions;
