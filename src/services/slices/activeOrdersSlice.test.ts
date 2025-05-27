import { expect, test } from '@jest/globals';
import {
  submittedOrdersSlice,
  fetchSubmitOrders,
  initialState
} from './activeOrdersSlice';

describe('Active Orders Slice', () => {
  test('sets loading state on pending', () => {
    const action = { type: fetchSubmitOrders.pending.type };
    const state = submittedOrdersSlice.reducer(initialState, action);
    expect(state.fetchingStatus).toBe(true);
    expect(state.orders).toEqual([]);
    expect(state.error).toBe(null);
  });

  test('updates orders on success', () => {
    const ordersData = [{ id: '1', name: 'Order 1' }];
    const action = {
      type: fetchSubmitOrders.fulfilled.type,
      payload: ordersData
    };
    const state = submittedOrdersSlice.reducer(initialState, action);
    expect(state.orders).toEqual(ordersData);
    expect(state.fetchingStatus).toBe(false);
  });

  test('handles error state', () => {
    const errorMessage = 'Error message';
    const action = {
      type: fetchSubmitOrders.rejected.type,
      error: { message: errorMessage }
    };
    const state = submittedOrdersSlice.reducer(initialState, action);
    expect(state.error).toBe(errorMessage);
    expect(state.fetchingStatus).toBe(false);
  });
});
