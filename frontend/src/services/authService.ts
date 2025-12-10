import api, { ApiResponse } from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/config/constants';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  role: 'buyer' | 'seller';
  companyName?: string;
  fullName?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  fullName?: string;
  companyName?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  // Login
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    
    if (response.success && response.data) {
      this.saveAuthData(response.data);
    }
    
    return response;
  }

  // Register
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    
    if (response.success && response.data) {
      this.saveAuthData(response.data);
    }
    
    return response;
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<{ token: string }>(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });

    if (response.success && response.data) {
      api.setAuthToken(response.data.token);
    }

    return response;
  }

  // Verify token
  async verifyToken(): Promise<ApiResponse<User>> {
    return api.get<User>(API_ENDPOINTS.AUTH.VERIFY);
  }

  // Get current user
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  // Get user role
  getUserRole(): string | null {
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  }

  // Save auth data to storage
  private saveAuthData(data: AuthResponse): void {
    api.setAuthToken(data.token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, data.user.role);
  }

  // Clear auth data from storage
  private clearAuthData(): void {
    api.removeAuthToken();
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  }
}

export const authService = new AuthService();
export default authService;
