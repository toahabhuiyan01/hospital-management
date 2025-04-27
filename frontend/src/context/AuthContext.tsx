import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'http://localhost:6969/api';

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setUserToken(token);
      } catch (e) {
        console.error('Failed to load token', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  useEffect(() => {
    const configInterceptor = () => {
      axios.defaults.baseURL = "http://localhost:6969/api";
      
      if(userToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${userToken}`;
      }

      axios.interceptors.response.use(
        response => response,
        error => {
          if (error.response.status === 401) {
            logout();
          }
          return Promise.reject(error);
        }
      )
    }

    configInterceptor();
  }, [userToken])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;
      
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
      
      return response.data;
    } catch (error) {
      console.error('Login error', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/auth/register`, {
        name,
        email,
        password,
      });

      const { token } = response.data;
      
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
      
      return response.data;
    } catch (error) {
      console.error('Registration error', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};