import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Save,
  XCircle,
  Building2,
  Users,
  FileText,
  GraduationCap,
  CheckCircle,
  Info
} from 'lucide-react';
import { stageService, Stage } from '@/services/admin/stageService';
import { endpointService, Endpoint } from '@/services/admin/endpointService';
import { useAuth } from '@/services/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const CreateStage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availableEndpoints, setAvailableEndpoints] = useState<Endpoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEndpointsLoading, setIsEndpointsLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    stage_type: '',
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    allowed_roles: [] as string[],
    blocked_endpoints: [] as string[],
    required_permissions: [] as string[]
  });

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const fetchEndpoints = async () => {
    try {
      setIsEndpointsLoading(true);
      const endpointsResponse = await endpointService.getAllEndpoints();
      setAvailableEndpoints(endpointsResponse.flat_list || []);
    } catch (err) {
      console.error('Error fetching endpoints:', err);
      toast({
        title: "Error",
        description: "Failed to load available endpoints",
        variant: "destructive",
      });
    } finally {
      setIsEndpointsLoading(false);
    }
  };

  const handleCreateStage = async () => {
    try {
      setIsLoading(true);
      await stageService.createStage(formData);
      toast({
        title: "Success",
        description: "Stage created successfully",
      });
      navigate('/admin/stages');
    } catch (err) {
      console.error('Error creating stage:', err);
      toast({
        title: "Error",
        description: "Failed to create stage",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEndpointDisplayName = (endpoint: Endpoint) => {
    const method = endpoint.methods[0] || 'GET';
    return `${method} ${endpoint.path}`;
  };

  const getEndpointSummary = (endpoint: Endpoint) => {
    return endpoint.summary || `${endpoint.methods.join(', ')} ${endpoint.path}`;
  };

  const getStageIcon = (stageType: string) => {
    switch (stageType) {
      case 'stage_1': return <Building2 className="h-4 w-4" />;
      case 'stage_2': return <Users className="h-4 w-4" />;
      case 'stage_3': return <FileText className="h-4 w-4" />;
      case 'stage_4': return <GraduationCap className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/stages')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Stages
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Stage</h1>
          <p className="text-muted-foreground">
            Create a new stage to control access to different functionalities
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Define the stage type, name, and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stage_type">Stage Type</Label>
                <Select value={formData.stage_type} onValueChange={(value) => setFormData({...formData, stage_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stage_1">Stage 1 - College Registration</SelectItem>
                    <SelectItem value="stage_2">Stage 2 - Student Registration</SelectItem>
                    <SelectItem value="stage_3">Stage 3 - Application Processing</SelectItem>
                    <SelectItem value="stage_4">Stage 4 - Results and Allotment</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Stage Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter stage name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter stage description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Timeline
            </CardTitle>
            <CardDescription>
              Set the start and end dates for this stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Access Control
            </CardTitle>
            <CardDescription>
              Configure who can access this stage and what endpoints are blocked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Allowed Roles */}
            <div>
              <Label>Allowed Roles</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['admin', 'college', 'student'].map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`role_${role}`}
                      checked={formData.allowed_roles.includes(role)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            allowed_roles: [...formData.allowed_roles, role]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            allowed_roles: formData.allowed_roles.filter(r => r !== role)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`role_${role}`} className="text-sm capitalize">{role}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Blocked Endpoints */}
            <div>
              <Label>Blocked Endpoints</Label>
              <div className="mt-2">
                {isEndpointsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading endpoints...</p>
                  </div>
                ) : (
                  <>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (value && !formData.blocked_endpoints.includes(value)) {
                          setFormData({
                            ...formData,
                            blocked_endpoints: [...formData.blocked_endpoints, value]
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select endpoints to block" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEndpoints.map((endpoint) => (
                          <SelectItem key={endpoint.path} value={endpoint.path}>
                            <div className="flex flex-col">
                              <span className="font-medium">{getEndpointDisplayName(endpoint)}</span>
                              <span className="text-xs text-muted-foreground">{getEndpointSummary(endpoint)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 space-y-1">
                      {formData.blocked_endpoints.map((endpointPath) => {
                        const endpoint = availableEndpoints.find(ep => ep.path === endpointPath);
                        return (
                          <div key={endpointPath} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{endpoint ? getEndpointDisplayName(endpoint) : `${endpointPath}`}</span>
                              <span className="text-xs text-muted-foreground">{endpoint ? getEndpointSummary(endpoint) : endpointPath}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  blocked_endpoints: formData.blocked_endpoints.filter(ep => ep !== endpointPath)
                                });
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Select API endpoints that should be blocked during this stage
                </p>
              </div>
            </div>

            {/* Required Permissions */}
            <div>
              <Label>Required Permissions</Label>
              <div className="mt-2">
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !formData.required_permissions.includes(value)) {
                      setFormData({
                        ...formData,
                        required_permissions: [...formData.required_permissions, value]
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select required permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read:colleges">Read Colleges</SelectItem>
                    <SelectItem value="write:colleges">Write Colleges</SelectItem>
                    <SelectItem value="read:students">Read Students</SelectItem>
                    <SelectItem value="write:students">Write Students</SelectItem>
                    <SelectItem value="read:applications">Read Applications</SelectItem>
                    <SelectItem value="write:applications">Write Applications</SelectItem>
                    <SelectItem value="read:results">Read Results</SelectItem>
                    <SelectItem value="write:results">Write Results</SelectItem>
                    <SelectItem value="admin:stages">Admin Stages</SelectItem>
                    <SelectItem value="admin:users">Admin Users</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 space-y-1">
                  {formData.required_permissions.map((permission) => (
                    <div key={permission} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm font-medium">{permission}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            required_permissions: formData.required_permissions.filter(p => p !== permission)
                          });
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Select permissions required to access this stage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/stages')}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateStage}
          disabled={isLoading || !formData.stage_type || !formData.name || !formData.start_date || !formData.end_date}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create Stage
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateStage;
