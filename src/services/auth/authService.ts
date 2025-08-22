import { apiClient } from '../apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: number;
  is_active: boolean;
  is_verified: boolean;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginResponse {
  user: User;
  tokens: Tokens;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface SetNewPasswordRequest {
  email: string;
  new_password: string;
}

class AuthService {
  private readonly baseUrl = 'http://localhost:8000/api/auth';

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/login`, credentials);
      
      // Store tokens in localStorage
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access_token);
        localStorage.setItem('refresh_token', response.data.tokens.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/register`, userData);
      
      // Store tokens in localStorage if registration includes auto-login
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access_token);
        localStorage.setItem('refresh_token', response.data.tokens.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear stored tokens and user data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Optionally call logout endpoint if available
      // await apiClient.post(`${this.baseUrl}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(`${this.baseUrl}/refresh`, {
        refresh_token: refreshToken
      });

      // Update stored tokens
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }

      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear tokens on refresh failure
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      throw error;
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  getUserRole(): number | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  async verifyEmailForReset(email: string): Promise<void> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/password-reset`, {
        email: email
      });
      
      // If successful, the API will handle the verification
      // No need to store anything for password reset verification
      return response.data;
    } catch (error) {
      console.error('Password reset verification error:', error);
      throw error;
    }
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/set-new-password`, {
        email: email,
        new_password: newPassword
      });
      
      // If successful, password has been reset
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 