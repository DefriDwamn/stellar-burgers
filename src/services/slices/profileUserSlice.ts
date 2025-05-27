import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser, TRegisterData } from '@utils-types';
import {
  getUserApi,
  updateUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData
} from '../../utils/burger-api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

// Типы для состояния и ошибок
type TProfileState = {
  user: TUser | null;
  isDataLoading: boolean;
  error: string | null;
  isLoading: boolean;
};

type ApiError = {
  message: string;
};

// Константы для сообщений об ошибках
const ERROR_MESSAGES = {
  UPDATE_FAILED: 'Обновление пользователя не удалось',
  REGISTRATION_FAILED: 'Регистрация не удалась',
  LOGIN_FAILED: 'Вход не удался',
  USER_NOT_REGISTERED: 'Пользователь не зарегистрирован',
  DEFAULT_ERROR: 'Ошибка выполнения'
} as const;

// Начальное состояние
export const initialState: TProfileState = {
  user: null,
  isDataLoading: false,
  error: null,
  isLoading: false
};

// Обработчики состояний
const handlePending = (state: TProfileState) => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (
  state: TProfileState,
  action: PayloadAction<unknown>
) => {
  state.isLoading = false;
  state.error =
    typeof action.payload === 'string'
      ? action.payload
      : ERROR_MESSAGES.DEFAULT_ERROR;
};

// Асинхронные действия
export const getUser = createAsyncThunk(
  'user/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response;
    } catch (error) {
      return rejectWithValue(
        (error as ApiError).message || ERROR_MESSAGES.DEFAULT_ERROR
      );
    }
  }
);

export const verifyUser = createAsyncThunk(
  'user/check',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      await dispatch(getUser());
    }
    dispatch(authChecked());
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const updatedUser = await updateUserApi(user);
      return updatedUser;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.UPDATE_FAILED);
    }
  }
);

export const userRegister = createAsyncThunk(
  'user/register',
  async (user: TRegisterData, { rejectWithValue }) => {
    try {
      const data = await registerUserApi(user);
      if (!data?.success) {
        return rejectWithValue(ERROR_MESSAGES.REGISTRATION_FAILED);
      }
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.REGISTRATION_FAILED);
    }
  }
);

export const profileLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData, { rejectWithValue }) => {
    try {
      const data = await loginUserApi({ email, password });
      if (!data?.success) {
        return rejectWithValue(ERROR_MESSAGES.LOGIN_FAILED);
      }
      setCookie('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return data.user;
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.LOGIN_FAILED);
    }
  }
);

export const userLogout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.clear();
    } catch (error) {
      return rejectWithValue(ERROR_MESSAGES.DEFAULT_ERROR);
    }
  }
);

// Создание slice
export const profileSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isDataLoading = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, handlePending)
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<{ user: TUser }>) => {
          state.user = action.payload.user;
          state.isLoading = false;
          state.isDataLoading = true;
        }
      )
      .addCase(getUser.rejected, handleRejected)
      .addCase(verifyUser.pending, handlePending)
      .addCase(verifyUser.rejected, (state) => {
        state.isLoading = false;
        state.isDataLoading = false;
        state.error = ERROR_MESSAGES.USER_NOT_REGISTERED;
      })
      .addCase(verifyUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isDataLoading = true;
      })
      .addCase(updateUser.pending, handlePending)
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<{ user: TUser }>) => {
          state.isLoading = false;
          state.user = action.payload.user;
        }
      )
      .addCase(updateUser.rejected, handleRejected)
      .addCase(userRegister.pending, handlePending)
      .addCase(
        userRegister.fulfilled,
        (state, action: PayloadAction<{ user: TUser }>) => {
          state.isLoading = false;
          state.user = action.payload.user;
        }
      )
      .addCase(userRegister.rejected, handleRejected)
      .addCase(profileLogin.pending, handlePending)
      .addCase(
        profileLogin.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.isDataLoading = true;
          state.user = action.payload;
        }
      )
      .addCase(profileLogin.rejected, handleRejected)
      .addCase(userLogout.pending, handlePending)
      .addCase(userLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      });
  }
});

// Экспорт действий и редюсера
export const { authChecked } = profileSlice.actions;
export default profileSlice.reducer;

// Селекторы
export const selectProfileUser = (state: { user: TProfileState }) => state.user;
