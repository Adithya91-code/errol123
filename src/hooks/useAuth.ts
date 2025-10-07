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
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser({
          id: userData.id?.toString() || '',
          email: userData.email,
          role: userData.role?.toLowerCase() as UserRole,
          created_at: new Date().toISOString(),
          farmer_id: userData.farmer_id,
          distributor_id: userData.distributor_id,
          name: userData.name,
          location: userData.location
        });
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting backend authentication');
      const response = await apiService.signIn(email, password);

      if (response.data) {
        console.log('Backend authentication successful:', response.data);
        const userSession: User = {
          id: response.data.id.toString(),
          email: response.data.email,
          role: response.data.role.toLowerCase() as UserRole,
          created_at: new Date().toISOString(),
          farmer_id: response.data.farmerId,
          distributor_id: response.data.distributorId,
          name: response.data.name,
          location: response.data.location
        };

        setUser(userSession);
        storage.setCurrentUser(userSession);
        return;
      } else {
        console.log('Backend authentication failed, trying local storage');
        throw new Error('Backend authentication failed');
      }
    } catch (error) {
      console.log('Backend authentication error:', error);

      const foundUser = storage.findUser(email, password);

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      console.log('Local storage authentication successful');
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
      storage.setCurrentUser(userSession);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, name?: string, location?: string) => {
    try {
      console.log('Attempting backend registration');
      const response = await apiService.signUp({
        email,
        password,
        name: name || '',
        location: location || '',
        role: role.toUpperCase()
      });

      if (response.data) {
        console.log('Backend registration successful');
        const userSession: User = {
          id: response.data.id.toString(),
          email: response.data.email,
          role: response.data.role.toLowerCase() as UserRole,
          created_at: new Date().toISOString(),
          farmer_id: response.data.farmerId,
          distributor_id: response.data.distributorId,
          name: response.data.name,
          location: response.data.location
        };

        setUser(userSession);
        storage.setCurrentUser(userSession);
        return;
      } else {
        throw new Error('Backend registration failed');
      }
    } catch (error) {
      console.error('Backend registration failed, using local storage:', error);

      if (storage.userExists(email)) {
        throw new Error('User with this email already exists');
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password,
        name: name || '',
        location: location || '',
        role,
        created_at: new Date().toISOString()
      };

      const createdUser = storage.addUser(newUser);

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
      storage.setCurrentUser(userSession);
    }
  };

  const signOut = async () => {
    apiService.signOut();
    setUser(null);
    storage.clearCurrentUser();
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
};
