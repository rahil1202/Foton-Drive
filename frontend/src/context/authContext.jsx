import React, { createContext, useContext, useEffect, useState } from 'react';
// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('_id'));
  const [email, setEmail] = useState(localStorage.getItem('email'));

  // function to check if token is expired
  const isTokenExpired = token => {
    if (!token) return true;
    try {
      // eslint-disable-next-line no-undef
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      return data.token;
    } catch (error) {
      console.error('Refresh token failed. Logging out...', error);
      logout();
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem('token');

      if (!token || isTokenExpired(token)) {
        logout();
      }

      if (token) {
        const _id = localStorage.getItem('_id');
        const email = localStorage.getItem('email');
        login(token, _id, email);

        setIsAuthenticated(true);
        setUserId(_id);
        setEmail(email);
      } else {
        logout();
      }
    };
    checkAuth();
  }),
    [];
  const login = (token, _id, email) => {
    // Save to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('_id', _id);
    localStorage.setItem('email', email);

    // Update state
    setIsAuthenticated(true);
    setUserId(_id);
    setEmail(email);
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    localStorage.removeItem('email');

    // Clear refresh token from cookies

    // Update state
    setIsAuthenticated(false);
    setUserId(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        email,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
