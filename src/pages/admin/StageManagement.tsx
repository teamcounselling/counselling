import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Settings,
  Play,
  Pause,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Users,
  Building2,
  GraduationCap,
  FileText,
  Zap,
  Info
} from 'lucide-react';
import { stageService, Stage, CurrentStageInfo } from '@/services/admin/stageService';
import { useAuth } from '@/services/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const StageManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStageInfo, setCurrentStageInfo] = useState<CurrentStageInfo | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [stagesResponse, currentStageResponse] = await Promise.all([
        stageService.getAllStages(),
        stageService.getCurrentStage()
      ]);

      // Handle the response structure - stagesResponse might be the data directly
      const stagesData = stagesResponse.data || stagesResponse;
      setStages(Array.isArray(stagesData) ? stagesData : []);
      setCurrentStageInfo(currentStageResponse);
    } catch (err) {
      console.error('Error fetching stage data:', err);
      setError('Failed to load stage data');
      toast({
        title: "Error",
        description: "Failed to load stage management data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitializeStages = async () => {
    try {
      setIsInitializing(true);
      const response = await stageService.initializeDefaultStages();
      toast({
        title: "Success",
        description: response.message,
      });
      fetchData();
    } catch (err) {
      console.error('Error initializing stages:', err);
      toast({
        title: "Error",
        description: "Failed to initialize default stages",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleActivateStage = async (stageId: number) => {
    try {
      await stageService.activateStage(stageId);
      toast({
        title: "Success",
        description: "Stage activated successfully",
      });
      fetchData();
    } catch (err) {
      console.error('Error activating stage:', err);
      toast({
        title: "Error",
        description: "Failed to activate stage",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateStage = async (stageId: number) => {
    try {
      await stageService.deactivateStage(stageId);
      toast({
        title: "Success",
        description: "Stage deactivated successfully",
      });
      fetchData();
    } catch (err) {
      console.error('Error deactivating stage:', err);
      toast({
        title: "Error",
        description: "Failed to deactivate stage",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStage = async (stageId: number) => {
    try {
      await stageService.deleteStage(stageId);
      toast({
        title: "Success",
        description: "Stage deleted successfully",
      });
      fetchData();
    } catch (err) {
      console.error('Error deleting stage:', err);
      toast({
        title: "Error",
        description: "Failed to delete stage",
        variant: "destructive",
      });
    }
  };

  const getStageTypeColor = (stageType: string) => {
    switch (stageType) {
      case 'stage_1': return 'bg-blue-100 text-blue-800';
      case 'stage_2': return 'bg-green-100 text-green-800';
      case 'stage_3': return 'bg-yellow-100 text-yellow-800';
      case 'stage_4': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading stage management...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchData} className="mt-2">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stage Management</h1>
          <p className="text-muted-foreground">
            Control access to different functionalities based on the current phase of the counselling process
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleInitializeStages} disabled={isInitializing}>
            {isInitializing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Initializing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Initialize Default Stages
              </>
            )}
          </Button>
          <Button onClick={() => navigate('/admin/stages/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Stage
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stages">All Stages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Current Stage Overview */}
          {currentStageInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Current Stage
                </CardTitle>
                <CardDescription>
                  {currentStageInfo.stage_info.message}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentStageInfo.current_stage.name}
                    </div>
                    <p className="text-sm text-muted-foreground">Active Stage</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {currentStageInfo.stage_info.days_remaining}
                    </div>
                    <p className="text-sm text-muted-foreground">Days Remaining</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {currentStageInfo.stage_info.progress_percentage}%
                    </div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={currentStageInfo.stage_info.progress_percentage} className="w-full" />
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2">Allowed Actions</h4>
                    <div className="space-y-1">
                      {currentStageInfo.allowed_actions.map((action, index) => (
                        <Badge key={index} variant="secondary" className="mr-1">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2">Blocked Actions</h4>
                    <div className="space-y-1">
                      {currentStageInfo.blocked_actions.map((action, index) => (
                        <Badge key={index} variant="destructive" className="mr-1">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stages</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stages?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Configured stages in the system
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Stage</CardTitle>
                <Play className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stages?.filter(s => s.is_active)?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently active stage
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive Stages</CardTitle>
                <Pause className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stages?.filter(s => !s.is_active)?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Inactive stages
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Stages</CardTitle>
              <CardDescription>
                Manage all stages in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stages?.map((stage) => (
                  <div key={stage.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStageIcon(stage.stage_type)}
                        <div>
                          <h3 className="font-semibold">{stage.name}</h3>
                          <p className="text-sm text-muted-foreground">{stage.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getStageTypeColor(stage.stage_type)}>
                              {stage.stage_type}
                            </Badge>
                            {stage.is_active ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Pause className="h-3 w-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {stage.is_active ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeactivateStage(stage.id)}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Deactivate
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivateStage(stage.id)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/stages/${stage.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Stage</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{stage.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteStage(stage.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Start:</span> {new Date(stage.start_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">End:</span> {new Date(stage.end_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Allowed Roles:</span> {stage.allowed_roles.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Blocked Endpoints:</span> {stage.blocked_endpoints.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StageManagement;
