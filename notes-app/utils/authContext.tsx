import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedAuthState = await AsyncStorage.getItem('authState');
      
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        console.log('Auth state changed:', currentUser?.email);
        
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          
          await AsyncStorage.setItem('authState', JSON.stringify({
            uid: currentUser.uid,
            email: currentUser.email,
            lastLogin: new Date().toISOString(),
          }));
        } else {
          setUser(null);
          setIsAuthenticated(false);
          await AsyncStorage.removeItem('authState');
        }
        
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error checking auth state:', error);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      setLoading(true);
      
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.setItem('rememberMe', 'false');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      await AsyncStorage.setItem('userEmail', email);
      
      console.log('User signed in:', userCredential.user.email);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await AsyncStorage.setItem('rememberMe', 'true');
      await AsyncStorage.setItem('userEmail', email);
      
      console.log('User created:', userCredential.user.email);
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      
      await AsyncStorage.multiRemove(['authState', 'userEmail', 'rememberMe']);
      
      setUser(null);
      setIsAuthenticated(false);
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
