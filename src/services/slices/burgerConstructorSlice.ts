import {
  nanoid,
  PayloadAction,
  createSlice,
  createSelector
} from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Типы
interface IBurgerConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

// Константы
const INGREDIENT_TYPES = {
  BUN: 'bun'
} as const;

// Начальное состояние
export const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: []
};

// Создание slice
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    getConstructorState: (state) => state,
    getIngredientCounters: createSelector(
      (state) => state,
      (state) => {
        const counters: Record<string, number> = {};

        // Подсчет обычных ингредиентов
        state.ingredients.forEach((ingredient: TConstructorIngredient) => {
          counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
        });

        // Добавление булочки (считается за 2)
        if (state.bun) {
          counters[state.bun._id] = 2;
        }

        return counters;
      }
    )
  },
  reducers: {
    addIngredientToConstructor: {
      prepare: (item: TIngredient) => ({
        payload: { ...item, id: nanoid() }
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === INGREDIENT_TYPES.BUN) {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      }
    },
    deleteIngredientFromConstructor: (state, action: PayloadAction<string>) => {
      const ingredientIndex = state.ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload
      );

      if (ingredientIndex >= 0) {
        state.ingredients.splice(ingredientIndex, 1);
      }
    },
    moveIngredientInConstructor: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;

      if (from !== to) {
        const [movedIngredient] = state.ingredients.splice(from, 1);
        state.ingredients.splice(to, 0, movedIngredient);
      }
    },
    clearConstructor: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
  }
});

// Экспорт действий
export const {
  addIngredientToConstructor,
  deleteIngredientFromConstructor,
  moveIngredientInConstructor,
  clearConstructor
} = burgerConstructorSlice.actions;

// Экспорт селекторов
export const { getConstructorState, getIngredientCounters } =
  burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
