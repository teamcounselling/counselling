import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/services/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getMenuItems } from '@/config/menuConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: number;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const roleRoutes = {
      1: '/admin/dashboard',
      2: '/student/dashboard', 
      3: '/college/dashboard'
    };
    const redirectPath = roleRoutes[user.role as keyof typeof roleRoutes] || '/login';
    return <Navigate to={redirectPath} replace />;
  }

  // Get menu items for the user's role
  const menuItems = getMenuItems(user.role);

  return (
    <DashboardLayout menuItems={menuItems}>
      {children}
    </DashboardLayout>
  );
}; 