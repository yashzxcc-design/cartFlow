import { AppDispatch, RootState } from '../../../store';
import { User } from '../../../types';
import { MockApiService } from '../../../services/api/mockApi';
import { setUser, setToken, logout, loadAuth } from '../../../store/slices/authSlice';
import { StorageService, StorageKeys } from '../../../services/storage/storage';
import { AuthState } from '../../../types';

export class AuthController {
  static async initializeAuth(dispatch: AppDispatch): Promise<void> {
    const savedUser = await StorageService.getObject<User>(StorageKeys.USER);
    const savedToken = await StorageService.getItem(StorageKeys.AUTH_TOKEN);

    if (savedUser && savedToken) {
      const authState: AuthState = {
        isAuthenticated: true,
        user: savedUser,
        token: savedToken,
      };
      dispatch(loadAuth(authState));
    }
  }

  static async login(
    email: string,
    password: string,
    dispatch: AppDispatch
  ): Promise<User> {
    const user = await MockApiService.login(email, password);
    const token = 'mock_token_' + Date.now();

    dispatch(setUser(user));
    dispatch(setToken(token));

    return user;
  }

  static logoutUser(dispatch: AppDispatch): void {
    dispatch(logout());
  }

  static isAuthenticated(state: RootState): boolean {
    return state.auth.isAuthenticated;
  }

  static getCurrentUser(state: RootState): User | undefined {
    return state.auth.user;
  }

  static async toggleLogin(
    isLoggedIn: boolean,
    dispatch: AppDispatch
  ): Promise<void> {
    if (isLoggedIn) {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 9876543210',
      };
      const token = 'mock_token_' + Date.now();
      dispatch(setUser(mockUser));
      dispatch(setToken(token));
    } else {
      this.logoutUser(dispatch);
    }
  }
}

