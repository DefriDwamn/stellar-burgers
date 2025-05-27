import {
  orderSlice,
  fetchOrder,
  clearOrder,
  initialState
} from './orderSlice';
import { expect, test } from '@jest/globals';

describe('Order Slice', () => {
  const mockOrder = {
    _id: '671239b2d829be001c776eb8',
    number: 56854,
    status: 'done',
    name: 'Флюоресцентный space экзо-плантаго люминесцентный метеоритный бургер',
    createdAt: '2024-10-18T10:34:26.623Z',
    updatedAt: '2024-10-18T10:34:27.349Z',
    ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0943']
  };

  test('sets loading state on pending', () => {
    const action = { type: fetchOrder.pending.type };
    const state = orderSlice.reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.orderClaim).toBe(true);
    expect(state.orderError).toBeNull();
  });

  test('updates order on success', () => {
    const action = {
      type: fetchOrder.fulfilled.type,
      payload: { order: mockOrder }
    };
    const state = orderSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orderDetails).toEqual(mockOrder);
    expect(state.orderClaim).toBe(false);
  });

  test('handles error state', () => {
    const action = {
      type: fetchOrder.rejected.type,
      error: { message: 'Ошибка создания заказа' }
    };
    const state = orderSlice.reducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orderError).toBe('Ошибка создания заказа');
  });

  test('clears order data', () => {
    const stateWithOrder = { ...initialState, orderDetails: mockOrder };
    const action = clearOrder();
    const state = orderSlice.reducer(stateWithOrder, action);
    expect(state.orderDetails).toBeNull();
  });
}); 