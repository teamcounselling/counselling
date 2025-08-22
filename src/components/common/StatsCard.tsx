import React from 'react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: string;
  icon?: React.ReactNode;
  variant?: 'admin' | 'student' | 'college' | 'default';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  variant = 'default'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'admin':
        return 'border-admin-primary/20 bg-gradient-to-br from-admin-primary/5 to-admin-light/5';
      case 'student':
        return 'border-student-primary/20 bg-gradient-to-br from-student-primary/5 to-student-light/5';
      case 'college':
        return 'border-college-primary/20 bg-gradient-to-br from-college-primary/5 to-college-light/5';
      default:
        return 'border-primary/20 bg-gradient-to-br from-primary/5 to-primary-light/5';
    }
  };

  return (
    <Card className={`p-6 ${getVariantClasses()} hover:shadow-md transition-smooth`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <p className="text-xs text-success mt-1">{trend}</p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${
            variant === 'admin' ? 'bg-admin-primary/10 text-admin-primary' :
            variant === 'student' ? 'bg-student-primary/10 text-student-primary' :
            variant === 'college' ? 'bg-college-primary/10 text-college-primary' :
            'bg-primary/10 text-primary'
          }`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};