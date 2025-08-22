import React from 'react';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  variant?: 'admin' | 'student' | 'college' | 'default';
}

interface NavigationProps {
  items: NavItem[];
  currentPath?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ items, currentPath }) => {
  return (
    <nav className="bg-card border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 h-14 items-center">
          {items.map((item) => (
            <Button
              key={item.href}
              variant={currentPath === item.href ? (item.variant || 'default') : 'ghost'}
              size="sm"
              asChild
            >
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};