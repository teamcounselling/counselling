import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Users, 
  FileText, 
  GraduationCap, 
  CheckCircle,
  Clock,
  AlertCircle,
  Info,
  Settings,
  XCircle
} from 'lucide-react';
import StageAccessControl from '@/components/common/StageAccessControl';
import StageStatusIndicator from '@/components/common/StageStatusIndicator';
import { useStageAccess, checkRegistrationAllowed } from '@/components/common/StageAccessControl';

// Example College Registration Form
const CollegeRegistrationForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          College Registration
        </CardTitle>
        <CardDescription>
          Register your college for the TNEA counselling process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">College Name</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter college name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">College Code</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter college code"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter email address"
            />
          </div>
          <Button className="w-full">Register College</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Example Student Registration Form
const StudentRegistrationForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Student Registration
        </CardTitle>
        <CardDescription>
          Register as a student for the TNEA counselling process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-md"
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded-md"
              placeholder="Enter email address"
            />
          </div>
          <Button className="w-full">Register Student</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Example Application Processing Component
const ApplicationProcessing: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Application Processing
        </CardTitle>
        <CardDescription>
          Process and verify submitted applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
            <div>
              <div className="font-medium">Pending Applications</div>
              <div className="text-sm text-gray-600">125 applications need review</div>
            </div>
            <Badge variant="secondary">125</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
            <div>
              <div className="font-medium">Approved Applications</div>
              <div className="text-sm text-gray-600">89 applications approved</div>
            </div>
            <Badge className="bg-green-100 text-green-800">89</Badge>
          </div>
          <Button className="w-full">Process Applications</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Example Results Component
const ResultsAndAllotment: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Results and Allotment
        </CardTitle>
        <CardDescription>
          View results and manage seat allotment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-md">
            <div>
              <div className="font-medium">Allotment Results</div>
              <div className="text-sm text-gray-600">Round 1 results available</div>
            </div>
            <Badge className="bg-purple-100 text-purple-800">Round 1</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
            <div>
              <div className="font-medium">Pending Allotments</div>
              <div className="text-sm text-gray-600">45 students waiting</div>
            </div>
            <Badge variant="secondary">45</Badge>
          </div>
          <Button className="w-full">View Results</Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Example Component Using useStageAccess Hook
const StageAccessHookExample: React.FC = () => {
  const { isAllowed, isLoading, currentStage } = useStageAccess('college', 'college_registration');

  const handleRegistration = async () => {
    const canRegister = await checkRegistrationAllowed('college');
    if (canRegister) {
      console.log('Registration allowed, proceeding...');
      // Proceed with registration logic
    } else {
      console.log('Registration not allowed');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="ml-2">Checking access...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stage Access Hook Example</CardTitle>
        <CardDescription>
          Demonstrates using the useStageAccess hook
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Access Status:</span>
          {isAllowed ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Allowed
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle className="h-3 w-3 mr-1" />
              Denied
            </Badge>
          )}
        </div>
        
        {currentStage && (
          <div className="p-3 bg-blue-50 rounded-md">
            <div className="font-medium text-sm">Current Stage: {currentStage.current_stage.name}</div>
            <div className="text-xs text-gray-600">{currentStage.stage_info.description}</div>
          </div>
        )}
        
        <Button onClick={handleRegistration} disabled={!isAllowed}>
          Try Registration
        </Button>
      </CardContent>
    </Card>
  );
};

// Main Example Component
const StageAccessExample: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Stage Management Examples</h1>
        <p className="text-gray-600">
          Examples of how to use the stage access control system
        </p>
      </div>

      {/* Stage Status Indicator Examples */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Minimal Variant</h3>
          <StageStatusIndicator variant="minimal" />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Compact Variant</h3>
          <StageStatusIndicator variant="compact" showProgress={true} />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Detailed Variant</h3>
          <StageStatusIndicator variant="detailed" showActions={true} />
        </div>
      </div>

      {/* Stage Access Control Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* College Registration with Access Control */}
        <div>
          <h3 className="font-semibold mb-4">College Registration (Protected)</h3>
          <StageAccessControl 
            requiredRole="college" 
            requiredAction="college_registration"
            fallback={
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  College registration is not currently available. Please check back later.
                </AlertDescription>
              </Alert>
            }
          >
            <CollegeRegistrationForm />
          </StageAccessControl>
        </div>

        {/* Student Registration with Access Control */}
        <div>
          <h3 className="font-semibold mb-4">Student Registration (Protected)</h3>
          <StageAccessControl 
            requiredRole="student" 
            requiredAction="student_registration"
            fallback={
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Student registration is not currently available. Please check back later.
                </AlertDescription>
              </Alert>
            }
          >
            <StudentRegistrationForm />
          </StageAccessControl>
        </div>

        {/* Application Processing with Access Control */}
        <div>
          <h3 className="font-semibold mb-4">Application Processing (Protected)</h3>
          <StageAccessControl 
            requiredRole="admin" 
            requiredAction="application_processing"
            fallback={
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Application processing is only available during the processing stage.
                </AlertDescription>
              </Alert>
            }
          >
            <ApplicationProcessing />
          </StageAccessControl>
        </div>

        {/* Results with Access Control */}
        <div>
          <h3 className="font-semibold mb-4">Results & Allotment (Protected)</h3>
          <StageAccessControl 
            requiredRole="admin" 
            requiredAction="results_allotment"
            fallback={
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Results and allotment will be available during the results stage.
                </AlertDescription>
              </Alert>
            }
          >
            <ResultsAndAllotment />
          </StageAccessControl>
        </div>
      </div>

      {/* Hook Example */}
      <div>
        <h3 className="font-semibold mb-4">useStageAccess Hook Example</h3>
        <StageAccessHookExample />
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              How to Use StageAccessControl
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>1. Wrap your component with StageAccessControl</p>
              <p>2. Specify required role and action</p>
              <p>3. Provide a fallback for when access is denied</p>
              <p>4. The component will automatically check access</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• requiredRole: User role required for access</p>
              <p>• requiredAction: Specific action required</p>
              <p>• fallback: Component to show when access denied</p>
              <p>• showStageInfo: Show current stage information</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StageAccessExample;
