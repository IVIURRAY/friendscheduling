import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableProviders, setAvailableProviders] = useState(['google']);

  useEffect(() => {
    checkAuthStatus();
    fetchAvailableProviders();
  }, []);

  const fetchAvailableProviders = async () => {
    try {
      const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiBaseUrl}/api/auth/providers`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableProviders(data.providers || ['google']);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
      setAvailableProviders(['google']);
    }
  };

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const userData = await apiService.getCurrentUser();
      if (userData && userData.id) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = () => {
    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const authUrl = `${apiBaseUrl}/oauth2/authorization/google`;
    window.location.href = authUrl;
  };

  const loginWithApple = () => {
    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    const authUrl = `${apiBaseUrl}/oauth2/authorization/apple`;
    window.location.href = authUrl;
  };

  const logout = () => {
    const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = `${apiBaseUrl}/logout`;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    availableProviders,
    loginWithGoogle,
    loginWithApple,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};