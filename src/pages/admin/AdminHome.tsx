import React from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/common/Navigation';
import { StatsCard } from '@/components/common/StatsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminHome: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', href: '/admin', variant: 'admin' as const },
    { label: 'User Management', href: '/admin/users', variant: 'admin' as const },
    { label: 'System Settings', href: '/admin/settings', variant: 'admin' as const },
    { label: 'Reports', href: '/admin/reports', variant: 'admin' as const },
  ];

  const recentActivities = [
    { action: 'New student registered', user: 'John Doe', time: '2 hours ago' },
    { action: 'Counselor appointment scheduled', user: 'Jane Smith', time: '4 hours ago' },
    { action: 'System backup completed', user: 'System', time: '6 hours ago' },
    { action: 'New college partner added', user: 'Admin', time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Admin Dashboard" role="admin" />
      <Navigation items={navItems} currentPath="/admin" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value="2,547"
            description="Active users"
            trend="+12% from last month"
            variant="admin"
            icon={<span className="text-xl">👥</span>}
          />
          <StatsCard
            title="Active Sessions"
            value="143"
            description="Current counseling sessions"
            trend="+5% from yesterday"
            variant="admin"
            icon={<span className="text-xl">💬</span>}
          />
          <StatsCard
            title="System Health"
            value="99.9%"
            description="Uptime this month"
            trend="Excellent performance"
            variant="admin"
            icon={<span className="text-xl">⚡</span>}
          />
          <StatsCard
            title="Revenue"
            value="$45,230"
            description="This month"
            trend="+18% from last month"
            variant="admin"
            icon={<span className="text-xl">💰</span>}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="admin" className="h-20 flex flex-col">
                <span className="text-2xl mb-1">👤</span>
                <span className="text-sm">Add User</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <span className="text-2xl mb-1">📊</span>
                <span className="text-sm">View Reports</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <span className="text-2xl mb-1">⚙️</span>
                <span className="text-sm">System Config</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <span className="text-2xl mb-1">📧</span>
                <span className="text-sm">Send Notice</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <span className="text-2xl mb-1">🔧</span>
                <span className="text-sm">Maintenance</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <span className="text-2xl mb-1">📈</span>
                <span className="text-sm">Analytics</span>
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-admin-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">by {activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Activities
            </Button>
          </Card>
        </div>

        {/* System Status */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">System Status</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Database</p>
                <p className="text-sm text-muted-foreground">Operational</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg">
              <div>
                <p className="font-medium text-foreground">API Services</p>
                <p className="text-sm text-muted-foreground">Operational</p>
              </div>
              <div className="w-3 h-3 bg-success rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-4 bg-warning/10 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Email Service</p>
                <p className="text-sm text-muted-foreground">Degraded</p>
              </div>
              <div className="w-3 h-3 bg-warning rounded-full"></div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AdminHome;