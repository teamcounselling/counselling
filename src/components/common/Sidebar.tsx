import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/services/hooks/useAuth';
import { 
  Home, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Building2,
  GraduationCap,
  FileText,
  Calendar,
  BarChart3,
  UserCheck,
  Shield,
  Bell,
  CheckCircle
} from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  children?: MenuItem[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  menuItems: MenuItem[];
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Home,
  Users,
  Settings,
  Building2,
  GraduationCap,
  FileText,
  Calendar,
  BarChart3,
  UserCheck,
  Shield,
  Bell,
  CheckCircle
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, menuItems }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const IconComponent = iconMap[item.icon] || Home;
    const isActive = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <Link to={item.path}>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-10 px-3",
              isActive && "bg-secondary text-secondary-foreground"
            )}
          >
            <IconComponent className="h-4 w-4" />
            <span className="text-sm font-medium">{item.title}</span>
          </Button>
        </Link>
        
        {hasChildren && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children!.map((child) => {
              const ChildIconComponent = iconMap[child.icon] || Home;
              const isChildActive = location.pathname === child.path;
              
              return (
                <Link key={child.id} to={child.path}>
                  <Button
                    variant={isChildActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-8 px-3 text-xs",
                      isChildActive && "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <ChildIconComponent className="h-3 w-3" />
                    <span>{child.title}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full w-64 bg-background border-r transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Dashboard</h1>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role === 1 ? 'Admin' : user?.role === 2 ? 'Student' : 'College'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {menuItems.map(renderMenuItem)}
            </nav>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}; 