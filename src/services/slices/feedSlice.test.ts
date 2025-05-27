import { expect, test } from '@jest/globals';
import { feedSlice, fetchFeeds, initialState } from './feedSlice';

describe('Feed Slice', () => {
  test('sets loading state on pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBe(null);
  });

  test('updates feed data on success', () => {
    const feedData = {
      total: 100,
      totalToday: 10,
      orders: [{ id: '1', name: 'Order 1' }]
    };
    const action = { type: fetchFeeds.fulfilled.type, payload: feedData };
    const state = feedSlice.reducer(initialState, action);
    expect(state.feed.total).toBe(100);
    expect(state.feed.totalToday).toBe(10);
    expect(state.orders).toEqual(feedData.orders);
    expect(state.isLoading).toBe(false);
  });

  test('handles error state', () => {
    const errorMessage = 'Error message';
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: errorMessage }
    };
    const state = feedSlice.reducer(initialState, action);
    expect(state.error).toBe(errorMessage);
    expect(state.isLoading).toBe(false);
  });
});
