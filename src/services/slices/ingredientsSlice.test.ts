import {
  ingredientsSlice,
  fetchIngredients,
  initialState
} from './ingredientsSlice';
import { expect, test } from '@jest/globals';

describe('Ingredients Slice', () => {
  test('sets loading state on pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('updates ingredients on success', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [{ id: '1', name: 'Булка' }]
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([{ id: '1', name: 'Булка' }]);
  });

  test('handles error state', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
