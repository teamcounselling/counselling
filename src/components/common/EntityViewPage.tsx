import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Building, 
  GraduationCap, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  User,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminService, College, AdminUser, Student } from '@/services/admin/adminService';

interface EntityViewPageProps {
  entityType: 'college' | 'student' | 'admin';
}

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case 'college':
      return <Building className="w-6 h-6" />;
    case 'student':
      return <GraduationCap className="w-6 h-6" />;
    case 'admin':
      return <Shield className="w-6 h-6" />;
    default:
      return <User className="w-6 h-6" />;
  }
};

const getEntityTitle = (entityType: string) => {
  switch (entityType) {
    case 'college':
      return 'College Profile';
    case 'student':
      return 'Student Profile';
    case 'admin':
      return 'Administrator Profile';
    default:
      return 'Profile';
  }
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const EntityViewPage: React.FC<EntityViewPageProps> = ({ entityType }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<College | AdminUser | Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntity = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        let data;
        switch (entityType) {
          case 'college':
            data = await adminService.getCollegeById(parseInt(id));
            break;
          case 'student':
            data = await adminService.getStudentById(parseInt(id));
            break;
          case 'admin':
            data = await adminService.getUserById(parseInt(id));
            break;
          default:
            throw new Error('Invalid entity type');
        }

        setEntity(data);
      } catch (err) {
        console.error(`Error fetching ${entityType}:`, err);
        setError(err instanceof Error ? err.message : `Failed to fetch ${entityType}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEntity();
  }, [id, entityType]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (entity) {
      navigate(`/admin/${entityType}s/${entity.id}/edit`);
    }
  };

  const handleApprove = async () => {
    if (!entity || entityType !== 'college') return;

    try {
      const updatedEntity = await adminService.approveCollege(entity.id);
      setEntity(updatedEntity);
    } catch (err) {
      console.error('Error approving entity:', err);
      setError('Failed to approve entity');
    }
  };

  const handleReject = async () => {
    if (!entity || entityType !== 'college') return;

    try {
      await adminService.rejectCollege(entity.id);
      navigate(-1); // Go back to list
    } catch (err) {
      console.error('Error rejecting entity:', err);
      setError('Failed to reject entity');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading {entityType} details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error loading {entityType}</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <Button
                variant="outline"
                onClick={handleBack}
                className="mt-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="text-muted-foreground">
            {getEntityIcon(entityType)}
            <p className="mt-2">No {entityType} found</p>
            <Button variant="outline" onClick={handleBack} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            {getEntityIcon(entityType)}
            <h1 className="text-2xl font-semibold">{getEntityTitle(entityType)}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          
          {entityType === 'college' && 'status' in entity && entity.status === 'pending' && (
            <>
              <Button variant="success" onClick={handleApprove}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit {entityType}
              </DropdownMenuItem>
              {entityType === 'college' && 'status' in entity && entity.status === 'pending' && (
                <>
                  <DropdownMenuItem onClick={handleApprove}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleReject}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Entity Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getEntityIcon(entityType)}
              <span>
                {entityType === 'college' && 'name' in entity ? entity.name : 
                 entityType === 'student' && 'first_name' in entity ? `${entity.first_name} ${entity.last_name}` :
                 entityType === 'admin' && 'first_name' in entity ? `${entity.first_name} ${entity.last_name}` : 'Unknown'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entityType === 'college' && 'college_code' in entity && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">College Code</label>
                    <p className="text-sm font-mono">{entity.college_code}</p>
                  </div>
                )}
                
                {entityType === 'college' && 'type' in entity && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <Badge variant="outline" className="capitalize">{entity.type}</Badge>
                  </div>
                )}
                
                {entityType === 'student' && 'email' in entity && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{entity.email}</p>
                  </div>
                )}
                
                {entityType === 'admin' && 'email' in entity && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{entity.email}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {entityType === 'college' && 'status' in entity ? getStatusBadge(entity.status) :
                     entityType === 'student' && 'is_active' in entity ? getStatusBadge(entity.is_active ? 'active' : 'inactive') :
                     entityType === 'admin' && 'is_active' in entity ? getStatusBadge(entity.is_active ? 'active' : 'inactive') : 
                     <Badge variant="outline">Unknown</Badge>}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location Information (for colleges) */}
            {entityType === 'college' && 'city' in entity && (
              <div>
                <h3 className="text-lg font-medium mb-3">Location</h3>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{entity.city}, {entity.district}</span>
                </div>
              </div>
            )}

            <Separator />

            {/* Timestamps */}
            <div>
              <h3 className="text-lg font-medium mb-3">Timestamps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{formatDate(entity.created_at)}</p>
                </div>
                {'updated_at' in entity && entity.updated_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm">{formatDate(entity.updated_at)}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit {entityType}
            </Button>
            
            {entityType === 'college' && 'status' in entity && entity.status === 'pending' && (
              <>
                <Button variant="success" className="w-full justify-start" onClick={handleApprove}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve {entityType}
                </Button>
                <Button variant="destructive" className="w-full justify-start" onClick={handleReject}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject {entityType}
                </Button>
              </>
            )}
            
            <Button variant="outline" className="w-full justify-start" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
