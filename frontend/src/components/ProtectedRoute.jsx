import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { token, user } = useContext(AuthContext);

  // Si pas de token, rediriger vers login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si admin requis mais utilisateur n'est pas admin, rediriger vers accueil
  if (requireAdmin && (!user || user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;