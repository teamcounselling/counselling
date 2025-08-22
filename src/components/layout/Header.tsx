import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  title: string;
  role?: 'admin' | 'student' | 'college';
}

export const Header: React.FC<HeaderProps> = ({ title, role }) => {
  const { user, logout, bypassAuth, toggleBypass } = useAuth();

  const getRoleVariant = (role?: string) => {
    switch (role) {
      case 'admin': return 'admin';
      case 'student': return 'student';
      case 'college': return 'college';
      default: return 'default';
    }
  };

  return (
    <header className="bg-card border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            {role && (
              <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${
                role === 'admin' ? 'bg-admin-primary/10 text-admin-primary' :
                role === 'student' ? 'bg-student-primary/10 text-student-primary' :
                'bg-college-primary/10 text-college-primary'
              }`}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={bypassAuth ? "warning" : "outline"}
              size="sm"
              onClick={toggleBypass}
            >
              Auth: {bypassAuth ? "Bypassed" : "Active"}
            </Button>
            
            {user && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};