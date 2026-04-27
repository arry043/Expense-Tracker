import axios from 'axios';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_PORT = 5001;

const getExpoDevServerHost = () => {
  const scriptURL = NativeModules.SourceCode?.getConstants?.().scriptURL;
  return scriptURL?.match(/\/\/([^:/]+)(?::\d+)?\//)?.[1];
};

const getApiUrl = () => {
  if (Platform.OS === 'web') {
    return `http://localhost:${API_PORT}/api`;
  }

  const devServerHost = getExpoDevServerHost();
  if (devServerHost) {
    return `http://${devServerHost}:${API_PORT}/api`;
  }

  return Platform.OS === 'android'
    ? `http://10.0.2.2:${API_PORT}/api`
    : `http://localhost:${API_PORT}/api`;
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Configure a reference to a function to handle global logout
let logoutCallback = null;
export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

// Request interceptor: Attach JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token for request:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Token expired or invalid, logging out...');
      // Clear token to be safe
      await AsyncStorage.removeItem('userToken');
      
      // Trigger context logout flow
      if (logoutCallback) {
        logoutCallback();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
