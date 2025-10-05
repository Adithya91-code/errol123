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
    try {
      // Try backend authentication first
      const response = await apiService.signIn(email, password);
      
      if (response.data) {
        console.log('Backend authentication successful');
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
      }
    } catch (error) {
      console.log('Backend authentication error, trying local storage');
    }

    // Fallback to local storage
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
  };

  const signUp = async (email: string, password: string, role: UserRole, name: string, location: string) => {
    try {
      // Try backend registration first
      const response = await apiService.signUp({
        email,
        password,
        name,
        location,
        role: role.toUpperCase()
      });
      
      if (response.data) {
        // Registration successful, now sign in
        await signIn(email, password);
        return;
      }
    } catch (error) {
      console.error('Backend registration failed:', error);
    }

    // Fallback to local storage
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
    storage.setCurrentUser(userSession);
  };

  // Add overloaded signUp function for backward compatibility
  const signUpCompat = async (email: string, password: string, role: UserRole) => {
    return signUp(email, password, role, '', '');
  };

  const signOut = async () => {
    apiService.signOut();
    setUser(null);
    localStorage.removeItem('current_user');
  };

  useEffect(() => {
    // Check for existing user session
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  return {
    user,
    loading,
    signIn,
    signUp: signUpCompat,
    signOut
  };
};