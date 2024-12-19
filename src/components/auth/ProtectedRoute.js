import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Not logged in, redirect to login page with the return url
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // User's role doesn't match the required role, redirect to dashboard
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
