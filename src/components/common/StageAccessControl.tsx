import React, { useState, useEffect, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { stageService, CurrentStageInfo, RegistrationCheckResponse } from '@/services/admin/stageService';
import { useAuth } from '@/services/hooks/useAuth';

interface StageAccessControlProps {
  children: ReactNode;
  requiredRole?: string;
  requiredAction?: string;
  fallback?: ReactNode;
  showStageInfo?: boolean;
  className?: string;
}

interface StageAccessState {
  isAllowed: boolean;
  currentStage: CurrentStageInfo | null;
  registrationCheck: RegistrationCheckResponse | null;
  isLoading: boolean;
  error: string | null;
}

const StageAccessControl: React.FC<StageAccessControlProps> = ({
  children,
  requiredRole,
  requiredAction,
  fallback,
  showStageInfo = false,
  className = ''
}) => {
  const { user } = useAuth();
  const [stageState, setStageState] = useState<StageAccessState>({
    isAllowed: true,
    currentStage: null,
    registrationCheck: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    checkStageAccess();
  }, [user, requiredRole, requiredAction]);

  const checkStageAccess = async () => {
    try {
      setStageState(prev => ({ ...prev, isLoading: true, error: null }));

      // Get current stage information
      const currentStageInfo = await stageService.getCurrentStage();
      
      // Check registration if role is specified
      let registrationCheck = null;
      if (requiredRole) {
        registrationCheck = await stageService.checkRegistrationAllowed(requiredRole);
      }

      // Determine if access is allowed
      let isAllowed = true;
      
      if (currentStageInfo) {
        // Check if the required action is blocked in current stage
        if (requiredAction && currentStageInfo.blocked_actions.includes(requiredAction)) {
          isAllowed = false;
        }
        
        // Check if the required role is allowed in current stage
        if (requiredRole && !currentStageInfo.current_stage.allowed_roles.includes(requiredRole)) {
          isAllowed = false;
        }
      }

      setStageState({
        isAllowed,
        currentStage: currentStageInfo,
        registrationCheck,
        isLoading: false,
        error: null
      });
    } catch (err) {
      console.error('Error checking stage access:', err);
      setStageState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check stage access'
      }));
    }
  };

  if (stageState.isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-sm text-gray-600">Checking access...</span>
      </div>
    );
  }

  if (stageState.error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {stageState.error}
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal text-destructive underline"
            onClick={checkStageAccess}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!stageState.isAllowed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={className}>
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <XCircle className="h-5 w-5" />
              Access Restricted
            </CardTitle>
            <CardDescription className="text-orange-700">
              This action is not available in the current stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stageState.currentStage && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">
                    Current Stage: {stageState.currentStage.current_stage.name}
                  </span>
                </div>
                <p className="text-sm text-orange-700">
                  {stageState.currentStage.stage_info.description}
                </p>
                
                {requiredAction && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-orange-800 mb-1">Required Action:</p>
                    <Badge variant="destructive" className="text-xs">
                      {requiredAction}
                    </Badge>
                  </div>
                )}

                {requiredRole && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-orange-800 mb-1">Required Role:</p>
                    <Badge variant="outline" className="text-xs">
                      {requiredRole}
                    </Badge>
                  </div>
                )}

                <div className="mt-4 p-3 bg-white rounded-md border border-orange-200">
                  <p className="text-sm font-medium text-orange-800 mb-2">Available Actions:</p>
                  <div className="flex flex-wrap gap-1">
                    {stageState.currentStage.allowed_actions.map((action, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {action}
                      </Badge>
                    ))}
                  </div>
                </div>

                {stageState.registrationCheck && (
                  <div className="mt-3 p-3 bg-white rounded-md border border-orange-200">
                    <p className="text-sm font-medium text-orange-800 mb-1">Registration Status:</p>
                    <p className="text-sm text-orange-700">
                      {stageState.registrationCheck.message}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      Days remaining: {stageState.registrationCheck.days_remaining}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {children}
      {showStageInfo && stageState.currentStage && (
        <div className="mt-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800 text-sm">
                <Info className="h-4 w-4" />
                Current Stage Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {stageState.currentStage.current_stage.name}
                  </span>
                </div>
                <p className="text-xs text-blue-700">
                  {stageState.currentStage.stage_info.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <Clock className="h-3 w-3" />
                  <span>{stageState.currentStage.stage_info.days_remaining} days remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Hook for checking stage access
export const useStageAccess = (requiredRole?: string, requiredAction?: string) => {
  const [accessState, setAccessState] = useState({
    isAllowed: true,
    isLoading: true,
    error: null as string | null,
    currentStage: null as CurrentStageInfo | null
  });

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setAccessState(prev => ({ ...prev, isLoading: true, error: null }));

        const currentStageInfo = await stageService.getCurrentStage();
        
        let isAllowed = true;
        
        if (currentStageInfo) {
          if (requiredAction && currentStageInfo.blocked_actions.includes(requiredAction)) {
            isAllowed = false;
          }
          
          if (requiredRole && !currentStageInfo.current_stage.allowed_roles.includes(requiredRole)) {
            isAllowed = false;
          }
        }

        setAccessState({
          isAllowed,
          isLoading: false,
          error: null,
          currentStage: currentStageInfo
        });
      } catch (err) {
        console.error('Error checking stage access:', err);
        setAccessState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to check stage access'
        }));
      }
    };

    checkAccess();
  }, [requiredRole, requiredAction]);

  return accessState;
};

// Utility function to check if registration is allowed
export const checkRegistrationAllowed = async (role: string): Promise<boolean> => {
  try {
    const response = await stageService.checkRegistrationAllowed(role);
    return response.allowed;
  } catch (err) {
    console.error('Error checking registration:', err);
    return false;
  }
};

// Utility function to get current stage info
export const getCurrentStageInfo = async (): Promise<CurrentStageInfo | null> => {
  try {
    return await stageService.getCurrentStage();
  } catch (err) {
    console.error('Error getting current stage:', err);
    return null;
  }
};

export default StageAccessControl;
