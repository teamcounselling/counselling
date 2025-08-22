import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User as ApiUser, LoginResponse, RegisterRequest } from '@/services/auth/authService';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student' | 'college';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  bypassAuth: boolean;
  toggleBypass: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo (fallback)
const mockUsers = {
  admin: { id: '1', email: 'admin@counseling.com', name: 'Admin User', role: 'admin' as const },
  student: { id: '2', email: 'student@university.edu', name: 'John Doe', role: 'student' as const },
  college: { id: '3', email: 'college@university.edu', name: 'University Counseling', role: 'college' as const }
};

// Helper function to convert API user to context user
const convertApiUserToContextUser = (apiUser: ApiUser): User => {
  const roleMap: { [key: number]: 'admin' | 'student' | 'college' } = {
    1: 'admin',
    2: 'student', 
    3: 'college'
  };
  
  return {
    id: apiUser.id.toString(),
    email: apiUser.email,
    name: `${apiUser.first_name} ${apiUser.last_name}`,
    role: roleMap[apiUser.role] || 'student'
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bypassAuth, setBypassAuth] = useState(false); // Start with real API enabled

  // Check for existing user on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(convertApiUserToContextUser(currentUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      if (bypassAuth) {
        // Use mock login for development
    await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(mockUsers.admin);
        setIsLoading(false);
        return true;
      }

      // Use actual API
      const response: LoginResponse = await authService.login({ email, password });
      const contextUser = convertApiUserToContextUser(response.user);
      setUser(contextUser);
      setIsLoading(false);
      return true;
    } catch (error: unknown) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      // Handle specific error cases
      const axiosError = error as { 
        response?: { 
          status: number;
          data?: { 
            detail?: string;
            message?: string;
            error?: string;
          };
        };
        message?: string;
        code?: string;
      };
      
      // Network errors
      if (axiosError.code === 'NETWORK_ERROR' || axiosError.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      // Server errors (5xx)
      if (axiosError.response?.status && axiosError.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      // Authentication errors
      if (axiosError.response?.status === 401) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      
      // Validation errors
      if (axiosError.response?.status === 422) {
        const errorMessage = axiosError.response.data?.detail || 
                           axiosError.response.data?.message || 
                           axiosError.response.data?.error ||
                           'Please check your email and password format';
        throw new Error(errorMessage);
      }
      
      // Bad request errors
      if (axiosError.response?.status === 400) {
        const errorMessage = axiosError.response.data?.detail || 
                           axiosError.response.data?.message || 
                           axiosError.response.data?.error ||
                           'Invalid login request. Please check your input.';
        throw new Error(errorMessage);
      }
      
      // Rate limiting
      if (axiosError.response?.status === 429) {
        throw new Error('Too many login attempts. Please wait a moment and try again.');
      }
      
      // Forbidden
      if (axiosError.response?.status === 403) {
        throw new Error('Access denied. Your account may be suspended.');
      }
      
      // Not found
      if (axiosError.response?.status === 404) {
        throw new Error('Login service not found. Please contact support.');
      }
      
      // Timeout errors
      if (axiosError.code === 'ECONNABORTED' || axiosError.message?.includes('timeout')) {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      
      // Other specific error messages from API
      if (axiosError.response?.data) {
        const apiMessage = axiosError.response.data.detail || 
                          axiosError.response.data.message || 
                          axiosError.response.data.error;
        if (apiMessage) {
          throw new Error(apiMessage);
        }
      }
      
      // Generic error message
      if (axiosError.message) {
        throw new Error(`Login failed: ${axiosError.message}`);
      }
      
      // Fallback error
      throw new Error('Login failed. Please try again later.');
    }
  };

  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    
    try {
      if (bypassAuth) {
        // Use mock registration for development
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(mockUsers.student);
        setIsLoading(false);
        return true;
      }

      // Use actual API
      const response: LoginResponse = await authService.register(userData);
      const contextUser = convertApiUserToContextUser(response.user);
      setUser(contextUser);
      setIsLoading(false);
      return true;
    } catch (error: unknown) {
      console.error('Registration error:', error);
    setIsLoading(false);
      
      // Handle specific error cases
      const axiosError = error as { 
        response?: { 
          status: number;
          data?: { 
            detail?: string;
            message?: string;
            error?: string;
          };
        };
        message?: string;
      };
      
      if (axiosError.response?.status === 409) {
        throw new Error('Email already exists');
      } else if (axiosError.response?.status === 422) {
        // Try to extract detailed error message from response
        const errorMessage = axiosError.response.data?.detail || 
                           axiosError.response.data?.message || 
                           axiosError.response.data?.error ||
                           'Please check your registration details';
        throw new Error(errorMessage);
      } else if (axiosError.response?.status === 400) {
        const errorMessage = axiosError.response.data?.detail || 
                           axiosError.response.data?.message || 
                           axiosError.response.data?.error ||
                           'Invalid registration data';
        throw new Error(errorMessage);
      } else {
        // Use the error message from the API if available
        const errorMessage = axiosError.message || 'Registration failed. Please try again.';
        throw new Error(errorMessage);
      }
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
    setUser(null);
    }
  };

  const toggleBypass = () => {
    setBypassAuth(!bypassAuth);
    if (!bypassAuth) {
      setUser(null); // Clear user when disabling bypass
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      bypassAuth,
      toggleBypass
    }}>
      {children}
    </AuthContext.Provider>
  );
};