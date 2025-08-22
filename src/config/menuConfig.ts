export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  children?: MenuItem[];
}

export interface MenuConfig {
  [role: number]: MenuItem[];
}

export const menuConfig: MenuConfig = {
  // Admin Menu (role: 1)
  1: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: 'Home'
    },
    {
      id: 'colleges',
      title: 'Colleges',
      path: '/admin/colleges',
      icon: 'Building2'
    },
    {
      id: 'students',
      title: 'Students',
      path: '/admin/students',
      icon: 'GraduationCap'
    },
    {
      id: 'administrators',
      title: 'Administrators',
      path: '/admin/admins',
      icon: 'Shield'
    },
    {
      id: 'programs',
      title: 'Program Management',
      path: '/admin/programs',
      icon: 'FileText',
      children: [
        {
          id: 'all-programs',
          title: 'All Programs',
          path: '/admin/programs/all',
          icon: 'FileText'
        },
        {
          id: 'pending-approvals',
          title: 'Pending Approvals',
          path: '/admin/programs/pending',
          icon: 'UserCheck'
        },
        {
          id: 'approved-programs',
          title: 'Approved Programs',
          path: '/admin/programs/approved',
          icon: 'CheckCircle'
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      path: '/admin/reports',
      icon: 'BarChart3',
    },
    {
      id: 'stages',
      title: 'Stage Management',
      path: '/admin/stages',
      icon: 'Clock'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      path: '/admin/notifications',
      icon: 'Bell'
    },
    {
      id: 'settings',
      title: 'Settings',
      path: '/admin/settings',
      icon: 'Settings'
    }
  ],

  // Student Menu (role: 2)
  2: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/student/dashboard',
      icon: 'Home'
    },
    {
      id: 'programs',
      title: 'Programs',
      path: '/student/programs',
      icon: 'FileText'
    },
    {
      id: 'appointments',
      title: 'Appointments',
      path: '/student/appointments',
      icon: 'Calendar'
    },
    {
      id: 'profile',
      title: 'Profile',
      path: '/student/profile',
      icon: 'UserCheck'
    },
    {
      id: 'settings',
      title: 'Settings',
      path: '/student/settings',
      icon: 'Settings'
    }
  ],

  // College Menu (role: 3)
  3: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      path: '/college/dashboard',
      icon: 'Home'
    },
    {
      id: 'programs',
      title: 'Program Management',
      path: '/college/programs',
      icon: 'FileText',
      children: [
        {
          id: 'my-programs',
          title: 'My Programs',
          path: '/college/programs/my',
          icon: 'FileText'
        },
        {
          id: 'create-program',
          title: 'Create Program',
          path: '/college/programs/create',
          icon: 'FileText'
        },
        {
          id: 'pending-approvals',
          title: 'Pending Approvals',
          path: '/college/programs/pending',
          icon: 'UserCheck'
        }
      ]
    },
    {
      id: 'students',
      title: 'Student Management',
      path: '/college/students',
      icon: 'GraduationCap'
    },
    {
      id: 'reports',
      title: 'Reports',
      path: '/college/reports',
      icon: 'BarChart3'
    },
    {
      id: 'settings',
      title: 'Settings',
      path: '/college/settings',
      icon: 'Settings'
    }
  ]
};

export const getMenuItems = (role: number): MenuItem[] => {
  return menuConfig[role] || [];
}; 