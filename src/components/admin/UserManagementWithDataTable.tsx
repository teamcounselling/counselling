import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building, GraduationCap, Mail, Phone } from 'lucide-react';
import { 
  DataTable, 
  Column, 
  Action,
  createViewAction,
  createEditAction,
  createApproveAction,
  createRejectAction,
  createStatusBadgeRenderer
} from '@/components/common/DataTable';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'college' | 'counselor' | 'admin';
  status: 'pending' | 'active' | 'inactive' | 'approved' | 'rejected';
  lastLogin: string;
  registrationDate: string;
  phone?: string;
  institution?: string;
}

const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@university.edu', 
    role: 'student', 
    status: 'active', 
    lastLogin: '2 hours ago',
    registrationDate: '2024-01-15',
    phone: '+1 (555) 123-4567'
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane@university.edu', 
    role: 'student', 
    status: 'pending', 
    lastLogin: 'Never',
    registrationDate: '2024-01-20',
    phone: '+1 (555) 234-5678'
  },
  { 
    id: '3', 
    name: 'University Health Center', 
    email: 'health@university.edu', 
    role: 'college', 
    status: 'approved', 
    lastLogin: '3 hours ago',
    registrationDate: '2024-01-10',
    institution: 'University Health Center'
  },
  { 
    id: '4', 
    name: 'Dr. Sarah Wilson', 
    email: 'wilson@counseling.com', 
    role: 'counselor', 
    status: 'active', 
    lastLogin: '30 minutes ago',
    registrationDate: '2024-01-05',
    phone: '+1 (555) 345-6789'
  },
  { 
    id: '5', 
    name: 'Tech Institute', 
    email: 'admin@techinstitute.edu', 
    role: 'college', 
    status: 'pending', 
    lastLogin: 'Never',
    registrationDate: '2024-01-22',
    institution: 'Tech Institute'
  },
  { 
    id: '6', 
    name: 'Mike Johnson', 
    email: 'mike@college.edu', 
    role: 'student', 
    status: 'rejected', 
    lastLogin: '1 day ago',
    registrationDate: '2024-01-18',
    phone: '+1 (555) 456-7890'
  },
  { 
    id: '7', 
    name: 'Dr. Emily Brown', 
    email: 'brown@therapy.com', 
    role: 'counselor', 
    status: 'inactive', 
    lastLogin: '1 week ago',
    registrationDate: '2023-12-15',
    phone: '+1 (555) 567-8901'
  },
  { 
    id: '8', 
    name: 'Community College', 
    email: 'info@communitycollege.edu', 
    role: 'college', 
    status: 'approved', 
    lastLogin: '5 hours ago',
    registrationDate: '2024-01-12',
    institution: 'Community College'
  }
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'student':
      return <GraduationCap className="w-4 h-4" />;
    case 'college':
      return <Building className="w-4 h-4" />;
    case 'counselor':
      return <User className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

export const UserManagementWithDataTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);

  const handleView = (user: User) => {
    console.log('View user:', user.id);
    // Implement view user details modal/page
  };

  const handleEdit = (user: User) => {
    console.log('Edit user:', user.id);
    // Implement edit user modal/form
  };

  const handleApprove = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: 'approved' as const }
        : u
    ));
    console.log('Approved user:', user.id);
  };

  const handleReject = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: 'rejected' as const }
        : u
    ));
    console.log('Rejected user:', user.id);
  };

  const handleToggleStatus = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'active' ? 'inactive' as const : 'active' as const }
        : u
    ));
  };

  const handleAddUser = () => {
    console.log('Add new user');
    // Implement add user modal/form
  };

  // Define columns
  const columns: Column<User>[] = [
    {
      key: 'user',
      header: 'User',
      render: (user) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-admin-primary/10 rounded-full flex items-center justify-center">
            <span className="text-admin-primary font-medium">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.phone && (
              <div className="flex items-center space-x-2 mt-1">
                <Phone className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => (
        <div className="flex items-center space-x-2">
          {getRoleIcon(user.role)}
          <span className="capitalize">{user.role}</span>
          {user.institution && (
            <p className="text-xs text-muted-foreground">{user.institution}</p>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: createStatusBadgeRenderer({
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        active: 'bg-green-100 text-green-800 border-green-200',
        inactive: 'bg-gray-100 text-gray-800 border-gray-200',
        approved: 'bg-blue-100 text-blue-800 border-blue-200',
        rejected: 'bg-red-100 text-red-800 border-red-200'
      })
    },
    {
      key: 'registrationDate',
      header: 'Registration Date',
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {new Date(user.registrationDate).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (user) => (
        <span className="text-sm text-muted-foreground">
          {user.lastLogin}
        </span>
      )
    }
  ];

  // Define actions
  const actions: Action<User>[] = [
    createViewAction(handleView),
    createEditAction(handleEdit),
    createApproveAction(handleApprove, 'Approve'),
    createRejectAction(handleReject, 'Reject'),
    {
      key: 'toggle-status',
      label: 'Toggle Status',
      onClick: handleToggleStatus,
      show: (user) => user.status === 'active' || user.status === 'inactive',
      variant: 'warning',
      className: 'h-8 px-3'
    }
  ];

  // Status legend
  const statusLegend = [
    { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200' },
    { label: 'Approved', className: 'bg-blue-100 text-blue-800 border-blue-200' },
    { label: 'Rejected', className: 'bg-red-100 text-red-800 border-red-200' },
    { label: 'Inactive', className: 'bg-gray-100 text-gray-800 border-gray-200' }
  ];

  return (
    <Card className="p-6">
      <DataTable
        data={users}
        columns={columns}
        actions={actions}
        primaryKey="id"
        title="User Management"
        subtitle="Manage all users across the platform"
        addButton={{
          label: 'Add New User',
          onClick: handleAddUser,
          icon: <User className="w-4 h-4" />,
          variant: 'admin'
        }}
        statusLegend={statusLegend}
      />
    </Card>
  );
};
