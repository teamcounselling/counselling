import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  FileText, 
  TrendingUp, 
  UserCheck, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Settings,
  GraduationCap,
  Users2
} from 'lucide-react';
import { adminService, DashboardTiles } from '@/services/admin/adminService';
import { useAuth } from '@/services/hooks/useAuth';
import { LineChart, BarChart, PieChart, AreaChart } from '@/components/ui/charts';

const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard component rendering...');
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardTiles['data'][0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('User:', user);
        console.log('Fetching dashboard data...');
        setIsLoading(true);
        setError(null);
        
        // Check if user is authenticated
        if (!user) {
          console.log('No user found, skipping API call');
          setError('User not authenticated');
          setIsLoading(false);
          return;
        }
        
        const response = await adminService.getDashboardTiles();
        console.log('Dashboard data received:', response);
        setDashboardData(response.data[0]); // Get the first item from the array
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Mock data for charts
  const userActivityData = [
    { month: 'Jan', users: 120, colleges: 15, programs: 45 },
    { month: 'Feb', users: 180, colleges: 22, programs: 67 },
    { month: 'Mar', users: 250, colleges: 28, programs: 89 },
    { month: 'Apr', users: 320, colleges: 35, programs: 112 },
    { month: 'May', users: 410, colleges: 42, programs: 145 },
    { month: 'Jun', users: 520, colleges: 48, programs: 178 },
  ];

  const programStatsData = [
    { category: 'Computer Science', applications: 45, approved: 38, pending: 7 },
    { category: 'Engineering', applications: 32, approved: 28, pending: 4 },
    { category: 'Business', applications: 28, approved: 25, pending: 3 },
    { category: 'Arts', applications: 22, approved: 18, pending: 4 },
    { category: 'Medicine', applications: 35, approved: 30, pending: 5 },
  ];

  const userDistributionData = [
    { category: 'Students', value: 1247 },
    { category: 'Colleges', value: 45 },
    { category: 'Administrators', value: 12 },
    { category: 'Pending Approval', value: 23 },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_registered',
      message: 'New student registered: John Doe',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'program_submitted',
      message: 'New program submitted: Computer Science',
      time: '15 minutes ago',
      status: 'pending'
    },
    {
      id: 3,
      type: 'program_approved',
      message: 'Program approved: Business Administration',
      time: '1 hour ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'college_registered',
      message: 'New college registered: Tech University',
      time: '2 hours ago',
      status: 'success'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Success</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'error':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">Success</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              console.log('Manual retry clicked');
              setIsLoading(true);
              setError(null);
              adminService.getDashboardTiles()
                .then(response => {
                  console.log('Manual retry success:', response);
                  setDashboardData(response.data[0]);
                })
                .catch(err => {
                  console.error('Manual retry failed:', err);
                  setError('Failed to load dashboard data');
                })
                .finally(() => setIsLoading(false));
            }}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Retry API
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : error ? (
          // Error state
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : dashboardData ? (
          // Dynamic data from API
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{dashboardData.student.label}</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.student.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Registered students
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{dashboardData.college.label}</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.college.value}</div>
                <p className="text-xs text-muted-foreground">
                  Approved colleges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{dashboardData.seats.label}</CardTitle>
                <Users2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.seats.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Available seats
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{dashboardData.current_round.label}</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.current_round.value}</div>
                <p className="text-xs text-muted-foreground">
                  Current round
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>
              User and college registration trends over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
          <BarChart
              data={programStatsData}
              xField="category"
              yFields={['applications', 'approved', 'pending']}
              colors={['#0ea5e9', '#7c3aed', '#f59e0b']}
              height="300px"
              title="Program Statistics"
            />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <FileText className="h-6 w-6" />
              <span>Review Programs</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Settings className="h-6 w-6" />
              <span>System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard; 