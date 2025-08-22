import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../index';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: number; // 0 = admin, 1 = college, 2 = student
}

const ProtectedRouteExample: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If role is required and user doesn't have the required role
  if (requiredRole !== undefined && currentUser && currentUser.role !== requiredRole) {
    // Redirect based on user's actual role
    const userRole = currentUser.role;
    if (userRole === 0) {
      return <Navigate to="/admin/home" replace />;
    } else if (userRole === 1) {
      return <Navigate to="/college/home" replace />;
    } else if (userRole === 2) {
      return <Navigate to="/student/home" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRouteExample; 