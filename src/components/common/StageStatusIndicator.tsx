import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle,
  Building2,
  Users,
  FileText,
  GraduationCap,
  Settings
} from 'lucide-react';
import { stageService, CurrentStageInfo } from '@/services/admin/stageService';
import { useAuth } from '@/services/hooks/useAuth';

interface StageStatusIndicatorProps {
  variant?: 'compact' | 'detailed' | 'minimal';
  showProgress?: boolean;
  showActions?: boolean;
  className?: string;
}

const StageStatusIndicator: React.FC<StageStatusIndicatorProps> = ({
  variant = 'compact',
  showProgress = true,
  showActions = false,
  className = ''
}) => {
  const { user } = useAuth();
  const [currentStage, setCurrentStage] = useState<CurrentStageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentStage();
  }, []);

  const fetchCurrentStage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stageInfo = await stageService.getCurrentStage();
      setCurrentStage(stageInfo);
    } catch (err) {
      console.error('Error fetching current stage:', err);
      setError('Failed to load stage information');
    } finally {
      setIsLoading(false);
    }
  };

  const getStageIcon = (stageType: string) => {
    switch (stageType) {
      case 'stage_1': return <Building2 className="h-4 w-4" />;
      case 'stage_2': return <Users className="h-4 w-4" />;
      case 'stage_3': return <FileText className="h-4 w-4" />;
      case 'stage_4': return <GraduationCap className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getStageColor = (stageType: string) => {
    switch (stageType) {
      case 'stage_1': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'stage_2': return 'bg-green-100 text-green-800 border-green-200';
      case 'stage_3': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stage_4': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    if (variant === 'minimal') {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
          <span className="text-sm text-gray-600">Loading...</span>
        </div>
      );
    }
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-sm text-gray-600">Loading stage...</span>
      </div>
    );
  }

  if (error) {
    if (variant === 'minimal') {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600">Error</span>
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md ${className}`}>
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-600">Failed to load stage</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchCurrentStage}
          className="h-6 px-2 text-red-600 hover:text-red-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!currentStage) {
    if (variant === 'minimal') {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <XCircle className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">No active stage</span>
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-md ${className}`}>
        <XCircle className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-500">No active stage</span>
      </div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {getStageIcon(currentStage.current_stage.stage_type)}
        <Badge className={`text-xs ${getStageColor(currentStage.current_stage.stage_type)}`}>
          {currentStage.current_stage.name}
        </Badge>
        {showProgress && (
          <span className="text-xs text-gray-500">
            {currentStage.stage_info.days_remaining}d left
          </span>
        )}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm ${className}`}>
        <div className="flex items-center gap-2">
          {getStageIcon(currentStage.current_stage.stage_type)}
          <div>
            <div className="font-medium text-sm">
              {currentStage.current_stage.name}
            </div>
            <div className="text-xs text-gray-500">
              {currentStage.stage_info.days_remaining} days remaining
            </div>
          </div>
        </div>
        
        {showProgress && (
          <div className="flex-1 max-w-32">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{currentStage.stage_info.progress_percentage}%</span>
            </div>
            <Progress 
              value={currentStage.stage_info.progress_percentage} 
              className="h-2"
            />
          </div>
        )}

        <Badge className={`text-xs ${getStageColor(currentStage.current_stage.stage_type)}`}>
          Active
        </Badge>
      </div>
    );
  }

  // Detailed variant
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStageIcon(currentStage.current_stage.stage_type)}
          Current Stage: {currentStage.current_stage.name}
        </CardTitle>
        <CardDescription>
          {currentStage.stage_info.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {currentStage.stage_info.days_remaining}
            </div>
            <p className="text-sm text-gray-600">Days Remaining</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {currentStage.stage_info.progress_percentage}%
            </div>
            <p className="text-sm text-gray-600">Progress</p>
          </div>
        </div>

        {showProgress && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Stage Progress</span>
              <span>{currentStage.stage_info.progress_percentage}%</span>
            </div>
            <Progress 
              value={currentStage.stage_info.progress_percentage} 
              className="h-3"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-green-600 mb-2 text-sm">Allowed Actions</h4>
            <div className="flex flex-wrap gap-1">
              {currentStage.allowed_actions.slice(0, 3).map((action, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {action}
                </Badge>
              ))}
              {currentStage.allowed_actions.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{currentStage.allowed_actions.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-red-600 mb-2 text-sm">Blocked Actions</h4>
            <div className="flex flex-wrap gap-1">
              {currentStage.blocked_actions.slice(0, 3).map((action, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {action}
                </Badge>
              ))}
              {currentStage.blocked_actions.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{currentStage.blocked_actions.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="flex-1">
              <Info className="h-4 w-4 mr-1" />
              View Details
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Settings className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StageStatusIndicator;
