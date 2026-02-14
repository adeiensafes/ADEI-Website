import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { API_ENDPOINTS } from '../config/api';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { token, user, logout } = useContext(AuthContext);
  const [verified, setVerified] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // If no token at all, no need to verify
    if (!token) {
      setVerified(true);
      setAuthorized(false);
      return;
    }

    // If admin is not required, just check token exists
    if (!requireAdmin) {
      setVerified(true);
      setAuthorized(true);
      return;
    }

    // For admin routes, verify the role with the server
    const verifyAdmin = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.USER_PROFILE, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const serverUser = await response.json();
          if (serverUser.role === 'admin') {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
        } else {
          // Token is invalid or tampered — log the user out
          console.warn('Token verification failed — logging out');
          logout();
          setAuthorized(false);
        }
      } catch (error) {
        console.error('Error verifying admin access:', error);
        setAuthorized(false);
      }
      setVerified(true);
    };

    verifyAdmin();
  }, [token, requireAdmin, logout]);

  // Show loading while verifying with the server
  if (!verified) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        color: 'var(--text-secondary, #888)'
      }}>
        Vérification des autorisations...
      </div>
    );
  }

  // No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admin required but not authorized → redirect to home
  if (requireAdmin && !authorized) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
