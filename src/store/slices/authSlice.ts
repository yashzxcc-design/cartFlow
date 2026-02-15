import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { StorageService, StorageKeys } from '../../services/storage/storage';

const initialState: AuthState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      StorageService.saveObject(StorageKeys.USER, action.payload);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      StorageService.saveString(StorageKeys.AUTH_TOKEN, action.payload);
    },
    logout: (state) => {
      state.user = undefined;
      state.token = undefined;
      state.isAuthenticated = false;
      StorageService.remove(StorageKeys.USER);
      StorageService.remove(StorageKeys.AUTH_TOKEN);
    },
    loadAuth: (state, action: PayloadAction<AuthState>) => {
      return action.payload;
    },
  },
});

export const { setUser, setToken, logout, loadAuth } = authSlice.actions;

export default authSlice.reducer;

