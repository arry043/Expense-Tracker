import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setLogoutCallback } from '../services/api';

export const AuthContext = createContext();

const isSuccess = (value) => value === true || value === 'true';

const safeGetItem = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn(`Could not read ${key} from AsyncStorage:`, error?.message || error);
    return null;
  }
};

const safeSetItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Could not save ${key} to AsyncStorage:`, error?.message || error);
  }
};

const safeRemoveItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`Could not remove ${key} from AsyncStorage:`, error?.message || error);
  }
};

const normalizeUser = (userData) => {
  if (!userData || typeof userData !== 'object') return null;

  return {
    ...userData,
    isAdmin: isSuccess(userData.isAdmin),
    isActive: userData.isActive === undefined ? undefined : isSuccess(userData.isActive),
    isVerified: userData.isVerified === undefined ? undefined : isSuccess(userData.isVerified),
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize logout callback for Axios interceptor
  useEffect(() => {
    setLogoutCallback(logout);
  }, []);

  // Check login status on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await safeGetItem('userToken');
        const storedUser = await safeGetItem('userData');

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(normalizeUser(parsedUser));
        }
      } catch (e) {
        console.error('Failed to load local auth data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (userData, authToken) => {
    const safeUser = normalizeUser(userData);
    const safeToken = String(authToken);

    setToken(safeToken);
    setUser(safeUser);

    await safeSetItem('userToken', safeToken);
    await safeSetItem('userData', JSON.stringify(safeUser));
  };

  const logout = async () => {
    await safeRemoveItem('userToken');
    await safeRemoveItem('userData');
    
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
