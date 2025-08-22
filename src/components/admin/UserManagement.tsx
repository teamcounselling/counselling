import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal,
  User,
  Building,
  GraduationCap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminService, AdminUser } from '@/services/admin/adminService';

const getRoleIcon = (role: number) => {
  switch (role) {
    case 1: // admin
      return <User className="w-4 h-4" />;
    case 2: // college
      return <Building className="w-4 h-4" />;
    case 3: // student
      return <GraduationCap className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

const getRoleLabel = (role: number) => {
  switch (role) {
    case 1: return 'Admin';
    case 2: return 'College';
    case 3: return 'Student';
    default: return 'Unknown';
  }
};

const getStatusBadge = (isActive: boolean, isVerified: boolean) => {
  if (!isActive) {
    return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
  }
  if (!isVerified) {
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
  }
  return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getAllUsers(0);
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleView = (userId: number) => {
    console.log('View user:', userId);
    // Implement view user details modal/page
  };

  const handleEdit = (userId: number) => {
    console.log('Edit user:', userId);
    // Implement edit user modal/form
  };

  const handleApprove = async (userId: number) => {
    try {
      const updatedUser = await adminService.updateUser(userId, { is_verified: true });
      setUsers(users.map(user => 
        user.id === userId ? updatedUser : user
      ));
      console.log('Approved user:', userId);
    } catch (err) {
      console.error('Error approving user:', err);
      setError('Failed to approve user');
    }
  };

  const handleReject = async (userId: number) => {
    try {
      const updatedUser = await adminService.updateUser(userId, { is_active: false });
      setUsers(users.map(user => 
        user.id === userId ? updatedUser : user
      ));
      console.log('Rejected user:', userId);
    } catch (err) {
      console.error('Error rejecting user:', err);
      setError('Failed to reject user');
    }
  };

  const handleToggleStatus = async (userId: number) => {
    try {
      const updatedUser = await adminService.toggleUserStatus(userId);
      setUsers(users.map(user => 
        user.id === userId ? updatedUser : user
      ));
      console.log('Toggled status for user:', userId);
    } catch (err) {
      console.error('Error toggling user status:', err);
      setError('Failed to toggle user status');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
          <p className="text-muted-foreground mt-1">Manage all users across the platform</p>
        </div>
        <Button variant="admin" className="gap-2">
          <User className="w-4 h-4" />
          Add New User
        </Button>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="text-red-800 border-red-300 hover:bg-red-100"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && (
        <><div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-admin-primary/10 rounded-full flex items-center justify-center">
                <span className="text-admin-primary font-medium">
                            {user.first_name[0]}{user.last_name[0]}
                </span>
              </div>
              <div>
                          <p className="font-medium text-foreground">{user.first_name} {user.last_name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{getRoleLabel(user.role)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.is_active, user.is_verified)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(user.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(user.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        {!user.is_verified && user.is_active && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApprove(user.id)}
                              className="h-8 px-3"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(user.id)}
                              className="h-8 px-3"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                          </>
                        )}

                        {user.is_verified && user.is_active && (
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                            className="h-8 px-3"
                          >
                            Deactivate
                          </Button>
                        )}

                        {!user.is_active && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                            className="h-8 px-3"
                          >
                            Activate
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(user.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(user.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            {!user.is_verified && user.is_active && (
                              <>
                                <DropdownMenuItem onClick={() => handleApprove(user.id)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReject(user.id)}>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user.id)}
                              className={user.is_active ? 'text-destructive' : 'text-success'}
                            >
                              {user.is_active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
            </div>
                    </TableCell>
                  </TableRow>
                )))}
            </TableBody>
          </Table>
        </div><div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>Showing {users.length} users</p>
            <div className="flex items-center space-x-4">
              <span>Status Legend:</span>
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>
                <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
                <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>
              </div>
            </div>
          </div></>
      )}
    </Card>
  );
};