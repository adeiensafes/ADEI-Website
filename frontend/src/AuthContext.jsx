import React, { createContext, useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from './config/api';

export const AuthContext = createContext();

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Logout automatique après inactivité
  useEffect(() => {
    if (!token) return;

    const checkInactivity = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > INACTIVITY_TIMEOUT) {
        console.log('Session expirée par inactivité');
        logout();
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(checkInactivity);
  }, [token, lastActivity]);

  // Mettre à jour l'activité sur les interactions utilisateur
  useEffect(() => {
    if (!token) return;

    const updateActivity = () => setLastActivity(Date.now());
    
    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    return () => {
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
    };
  }, [token]);

  useEffect(() => {
    if (token && !user) {
      // Fetch full user profile from server (including badges)
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log('Setting user from server:', userData);
            setUser(userData);
          } else {
            // If profile fetch fails, try to decode token as fallback
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const userData = {
                id: payload.id,
                username: payload.username,
                email: payload.email,
                role: payload.role,
                // Default badge values
                is_president: false,
                is_representant: false,
                is_membre_adei: false,
                is_bureau_adei: false
              };
              console.log('Setting user from token (fallback):', userData);
              setUser(userData);
            } catch (error) {
              console.error('Error decoding token:', error);
              setToken(null);
              localStorage.removeItem('token');
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to token decoding
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userData = {
              id: payload.id,
              username: payload.username,
              email: payload.email,
              role: payload.role,
              // Default badge values
              is_president: false,
              is_representant: false,
              is_membre_adei: false,
              is_bureau_adei: false
            };
            console.log('Setting user from token (error fallback):', userData);
            setUser(userData);
          } catch (tokenError) {
            console.error('Error decoding token:', tokenError);
            setToken(null);
            localStorage.removeItem('token');
          }
        }
      };
      
      fetchUserProfile();
    } else if (!token) {
      setUser(null);
    }
  }, [token, user]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        setLastActivity(Date.now());
        localStorage.setItem('token', data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Erreur de connexion' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch(API_ENDPOINTS.LOGOUT, {
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
      const response = await fetch(API_ENDPOINTS.FEEDBACKS, {
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

  const refreshUserProfile = useCallback(async () => {
    if (!token) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Refreshing user profile:', userData);
        setUser(userData);
        return { success: true, user: userData };
      } else {
        return { success: false, message: 'Erreur lors du rafraîchissement du profil' };
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      return { success: false, message: 'Erreur lors du rafraîchissement du profil' };
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{
      token,
      user,
      login,
      logout,
      fetchMessages,
      refreshUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};