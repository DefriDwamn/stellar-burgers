import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

type TIngredientsSliceState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TIngredientsSliceState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => ({
        ...state,
        isLoading: true,
        error: null
      }))
      .addCase(fetchIngredients.fulfilled, (state, action) => ({
        ...state,
        ingredients: action.payload,
        isLoading: false
      }))
      .addCase(fetchIngredients.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        error: action.error.message || null
      }));
  }
});

// Селекторы
const selectIngredients = (state: { ingredients: TIngredientsSliceState }) =>
  state.ingredients.ingredients;
const selectIsLoading = (state: { ingredients: TIngredientsSliceState }) =>
  state.ingredients.isLoading;
const selectError = (state: { ingredients: TIngredientsSliceState }) =>
  state.ingredients.error;

// Мемоизированные селекторы
export const selectBuns = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'bun')
);

export const selectSauces = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'sauce')
);

export const selectMains = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'main')
);

export { selectIngredients, selectIsLoading, selectError };

export default ingredientsSlice.reducer;
