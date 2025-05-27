import {
  userSlice,
  fetchUser,
  updateUser,
  initialState
} from './userSlice';
import { expect, test } from '@jest/globals';

describe('User Slice', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  test('sets loading state on pending', () => {
    const action = { type: fetchUser.pending.type };
    const state = userSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('updates user data on success', () => {
    const action = {
      type: fetchUser.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });

  test('handles error state', () => {
    const action = {
      type: fetchUser.rejected.type,
      error: { message: 'Ошибка получения данных пользователя' }
    };
    const state = userSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка получения данных пользователя');
  });

  test('updates user profile', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: { user: { ...mockUser, name: 'Updated Name' } }
    };
    const state = userSlice.reducer({ ...initialState, user: mockUser }, action);
    expect(state.user?.name).toBe('Updated Name');
  });
}); 