import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

// Типы
type TIngredientsSliceState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

type ApiError = {
  message: string;
};

// Константы
const ERROR_MESSAGES = {
  FETCH_FAILED: 'Не удалось загрузить ингредиенты',
  DEFAULT_ERROR: 'Произошла ошибка'
} as const;

// Начальное состояние
export const initialState: TIngredientsSliceState = {
  ingredients: [],
  isLoading: false,
  error: null
};

// Асинхронные действия
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as ApiError).message || ERROR_MESSAGES.FETCH_FAILED
      );
    }
  }
);

// Создание slice
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredients = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || ERROR_MESSAGES.DEFAULT_ERROR;
      });
  }
});

// Базовые селекторы
const selectIngredientsState = (state: {
  ingredients: TIngredientsSliceState;
}) => state.ingredients;

const selectIngredients = createSelector(
  selectIngredientsState,
  (state) => state.ingredients
);

const selectIsLoading = createSelector(
  selectIngredientsState,
  (state) => state.isLoading
);

const selectError = createSelector(
  selectIngredientsState,
  (state) => state.error
);

// Мемоизированные селекторы для фильтрации ингредиентов
export const selectBuns = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'bun')
);

export const selectSauces = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'sauce')
);

export const selectMains = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'main')
);

// Экспорт селекторов
export { selectIngredients, selectIsLoading, selectError };

export default ingredientsSlice.reducer;
