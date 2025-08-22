import React, { useState } from 'react';
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
  Star,
  Calendar,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Counselor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  institution: string;
  status: 'active' | 'pending' | 'inactive' | 'approved' | 'rejected';
  joinDate: string;
  lastActive: string;
  rating: number;
  studentsCount: number;
  experience: string;
  license?: string;
}

const mockCounselors: Counselor[] = [
  { 
    id: '1', 
    name: 'Dr. Sarah Wilson', 
    email: 'wilson@counseling.com', 
    phone: '+1 (555) 123-4567',
    specialization: 'Mental Health & Anxiety',
    institution: 'University Health Center',
    status: 'active',
    joinDate: '2022-03-15',
    lastActive: '30 minutes ago',
    rating: 4.8,
    studentsCount: 12,
    experience: '8 years',
    license: 'LPC-12345'
  },
  { 
    id: '2', 
    name: 'Dr. Emily Brown', 
    email: 'brown@therapy.com', 
    phone: '+1 (555) 234-5678',
    specialization: 'Career Development',
    institution: 'Career Services Center',
    status: 'pending',
    joinDate: '2024-01-20',
    lastActive: 'Never',
    rating: 0,
    studentsCount: 0,
    experience: '5 years',
    license: 'LPC-67890'
  },
  { 
    id: '3', 
    name: 'Dr. Michael Chen', 
    email: 'chen@counseling.edu', 
    phone: '+1 (555) 345-6789',
    specialization: 'Academic Support',
    institution: 'Student Success Center',
    status: 'active',
    joinDate: '2021-09-01',
    lastActive: '2 hours ago',
    rating: 4.6,
    studentsCount: 8,
    experience: '6 years',
    license: 'LPC-11111'
  },
  { 
    id: '4', 
    name: 'Dr. Lisa Garcia', 
    email: 'garcia@therapy.com', 
    phone: '+1 (555) 456-7890',
    specialization: 'Relationship Counseling',
    institution: 'Wellness Center',
    status: 'inactive',
    joinDate: '2020-06-15',
    lastActive: '1 week ago',
    rating: 4.7,
    studentsCount: 5,
    experience: '10 years',
    license: 'LPC-22222'
  },
  { 
    id: '5', 
    name: 'Dr. James Thompson', 
    email: 'thompson@counseling.edu', 
    phone: '+1 (555) 567-8901',
    specialization: 'Substance Abuse',
    institution: 'Recovery Center',
    status: 'approved',
    joinDate: '2024-01-15',
    lastActive: '5 hours ago',
    rating: 4.9,
    studentsCount: 15,
    experience: '12 years',
    license: 'LPC-33333'
  },
  { 
    id: '6', 
    name: 'Dr. Amanda Davis', 
    email: 'davis@therapy.com', 
    phone: '+1 (555) 678-9012',
    specialization: 'Trauma & PTSD',
    institution: 'Mental Health Clinic',
    status: 'rejected',
    joinDate: '2024-01-18',
    lastActive: 'Never',
    rating: 0,
    studentsCount: 0,
    experience: '7 years',
    license: 'LPC-44444'
  },
  { 
    id: '7', 
    name: 'Dr. Robert Johnson', 
    email: 'johnson@counseling.edu', 
    phone: '+1 (555) 789-0123',
    specialization: 'Family Therapy',
    institution: 'Family Services Center',
    status: 'active',
    joinDate: '2023-01-10',
    lastActive: '1 day ago',
    rating: 4.5,
    studentsCount: 10,
    experience: '9 years',
    license: 'LPC-55555'
  },
  { 
    id: '8', 
    name: 'Dr. Jennifer Lee', 
    email: 'lee@therapy.com', 
    phone: '+1 (555) 890-1234',
    specialization: 'Eating Disorders',
    institution: 'Health & Wellness Center',
    status: 'pending',
    joinDate: '2024-01-22',
    lastActive: 'Never',
    rating: 0,
    studentsCount: 0,
    experience: '4 years',
    license: 'LPC-66666'
  }
];

const getStatusBadge = (status: string) => {
  const variants = {
    active: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    approved: 'bg-blue-100 text-blue-800 border-blue-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <Badge className={`${variants[status as keyof typeof variants]} border`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const getRatingStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star 
        key={i} 
        className={`w-3 h-3 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    );
  }
  return stars;
};

export const CounselorManagement: React.FC = () => {
  const [counselors, setCounselors] = useState<Counselor[]>(mockCounselors);

  const handleView = (counselorId: string) => {
    console.log('View counselor:', counselorId);
    // Implement view counselor details modal/page
  };

  const handleEdit = (counselorId: string) => {
    console.log('Edit counselor:', counselorId);
    // Implement edit counselor modal/form
  };

  const handleApprove = (counselorId: string) => {
    setCounselors(counselors.map(counselor => 
      counselor.id === counselorId 
        ? { ...counselor, status: 'approved' as const }
        : counselor
    ));
    console.log('Approved counselor:', counselorId);
  };

  const handleReject = (counselorId: string) => {
    setCounselors(counselors.map(counselor => 
      counselor.id === counselorId 
        ? { ...counselor, status: 'rejected' as const }
        : counselor
    ));
    console.log('Rejected counselor:', counselorId);
  };

  const handleToggleStatus = (counselorId: string) => {
    setCounselors(counselors.map(counselor => 
      counselor.id === counselorId 
        ? { ...counselor, status: counselor.status === 'active' ? 'inactive' as const : 'active' as const }
        : counselor
    ));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Counselor Management</h2>
          <p className="text-muted-foreground mt-1">Manage all counselors and their applications</p>
        </div>
        <Button variant="admin" className="gap-2">
          <User className="w-4 h-4" />
          Add New Counselor
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Counselor</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {counselors.map((counselor) => (
              <TableRow key={counselor.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-admin-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-admin-primary font-medium">
                        {counselor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{counselor.name}</p>
                      <p className="text-sm text-muted-foreground">{counselor.license}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{counselor.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{counselor.phone}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{counselor.specialization}</p>
                    <p className="text-sm text-muted-foreground">{counselor.experience} experience</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{counselor.institution}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(counselor.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {getRatingStars(counselor.rating)}
                    <span className="text-sm font-medium ml-1">({counselor.rating})</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-foreground">{counselor.studentsCount}</span>
                  <p className="text-xs text-muted-foreground">students</p>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(counselor.joinDate).toLocaleDateString()}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Last active: {counselor.lastActive}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(counselor.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(counselor.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    {counselor.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApprove(counselor.id)}
                          className="h-8 px-3"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(counselor.id)}
                          className="h-8 px-3"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {counselor.status === 'active' && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleToggleStatus(counselor.id)}
                        className="h-8 px-3"
                      >
                        Deactivate
                      </Button>
                    )}
                    
                    {counselor.status === 'inactive' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleToggleStatus(counselor.id)}
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
                        <DropdownMenuItem onClick={() => handleView(counselor.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(counselor.id)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Counselor
                        </DropdownMenuItem>
                        {counselor.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(counselor.id)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve Application
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(counselor.id)}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Application
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(counselor.id)}
                          className={counselor.status === 'active' ? 'text-destructive' : 'text-success'}
                        >
                          {counselor.status === 'active' ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <p>Showing {counselors.length} counselors</p>
        <div className="flex items-center space-x-4">
          <span>Status Legend:</span>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>
            <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
            <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
