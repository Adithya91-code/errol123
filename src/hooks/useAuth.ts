import { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole } from '../types';
import { apiService } from '../lib/api';
import { storage } from '../lib/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // For local storage implementation
    const foundUser = storage.findUser(email, password);
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    const userSession: User = {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role as UserRole,
      created_at: foundUser.created_at,
      farmer_id: foundUser.farmer_id,
      distributor_id: foundUser.distributor_id,
      name: foundUser.name,
      location: foundUser.location
    };

    setUser(userSession);
    localStorage.setItem('current_user', JSON.stringify(userSession));
  };

  const signUp = async (email: string, password: string, role: UserRole, name: string, location: string) => {
    // For local storage implementation, create user directly
    if (storage.userExists(email)) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password, // In production, this should be hashed
      name,
      location,
      role,
      created_at: new Date().toISOString()
    };

    const createdUser = storage.addUser(newUser);
    
    // Set current user
    const userSession: User = {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role as UserRole,
      created_at: createdUser.created_at,
      farmer_id: createdUser.farmer_id,
      distributor_id: createdUser.distributor_id,
      name: createdUser.name,
      location: createdUser.location
    };

    setUser(userSession);
    localStorage.setItem('current_user', JSON.stringify(userSession));
  };

  const signOut = async () => {
    apiService.signOut();
    setUser(null);
    localStorage.removeItem('current_user');
  };

  useEffect(() => {
    // Check for existing user session
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      try {
        const userSession = JSON.parse(storedUser);
        setUser(userSession);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('current_user');
      }
    }
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
};