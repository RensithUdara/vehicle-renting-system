import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from '../api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: Partial<User> & { password: string; password_confirmation: string }) => Promise<boolean>;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = authAPI.getCurrentUserFromStorage();
        if (savedUser && authAPI.isAuthenticated()) {
          // Verify token is still valid by fetching current user
          const response = await authAPI.getCurrentUser();
          if (response.success) {
            setUser(response.data);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const register = async (userData: Partial<User> & { password: string; password_confirmation: string }): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(userData);
      
      if (response.success) {
        setUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      updateProfile,
      isAuthenticated: !!user,
      hasRole,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};