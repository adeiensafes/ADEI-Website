import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token && !user) {
      // Try to decode the token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userData = {
          id: payload.id,
          username: payload.username,
          email: payload.email,
          role: payload.role
        };
        console.log('Setting user from token:', userData); // Debug log
        setUser(userData);
      } catch (error) {
        console.error('Error decoding token:', error);
        // If token is invalid, clear it
        setToken(null);
        localStorage.removeItem('token');
      }
    } else if (!token) {
      setUser(null);
    }
  }, [token, user]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Erreur de connexion' };
    }
  }, []);

  const register = useCallback(async (username, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.token) {
          setToken(data.token);
          setUser({ username });
          localStorage.setItem('token', data.token);
        }
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Erreur lors de la création du compte' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch('http://localhost:5001/api/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    }
  }, [token]);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/messages', {
        headers: { Authorization: token },
      });
      
      if (response.ok) {
        const data = await response.json();
        return { success: true, data };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.message };
      }
    } catch (error) {
      return { success: false, message: 'Erreur lors du chargement des messages' };
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login,
      register,
      logout,
      fetchMessages
    }}>
      {children}
    </AuthContext.Provider>
  );
};