import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Activity } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
  logActivity: (action: string, entity: string, entityId: string, details: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@rental.com',
    password: 'admin123',
    name: 'John Admin',
    role: 'admin',
    phone: '+1234567890',
    address: '123 Admin St',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'staff@rental.com',
    password: 'staff123',
    name: 'Jane Staff',
    role: 'staff',
    phone: '+1234567891',
    address: '456 Staff Ave',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    email: 'customer@rental.com',
    password: 'customer123',
    name: 'Bob Customer',
    role: 'customer',
    phone: '+1234567892',
    address: '789 Customer Rd',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      logActivity('login', 'user', foundUser.id, `User ${foundUser.name} logged in`);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    if (user) {
      logActivity('logout', 'user', user.id, `User ${user.name} logged out`);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email: userData.email!,
      password: userData.password,
      name: userData.name!,
      role: userData.role || 'customer',
      phone: userData.phone,
      address: userData.address,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    logActivity('register', 'user', newUser.id, `New user ${newUser.name} registered`);
    return true;
  };

  const hasRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const logActivity = (action: string, entity: string, entityId: string, details: string) => {
    if (!user) return;

    const activity: Activity = {
      id: Date.now().toString(),
      userId: user.id,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString(),
      user
    };

    const updatedActivities = [activity, ...activities].slice(0, 100); // Keep last 100 activities
    setActivities(updatedActivities);
    localStorage.setItem('activities', JSON.stringify(updatedActivities));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated: !!user,
      hasRole,
      logActivity
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