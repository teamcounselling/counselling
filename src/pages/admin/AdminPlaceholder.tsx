import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, BarChart3, Settings, Bell } from 'lucide-react';

interface AdminPlaceholderProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

const AdminPlaceholder: React.FC<AdminPlaceholderProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This page is under development and will be available soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Icon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Feature in Development</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We're working hard to bring you this feature. Check back soon for updates.
            </p>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPlaceholder; 