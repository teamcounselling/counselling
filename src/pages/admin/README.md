# Admin Pages Documentation

## Stage Management System

The Stage Management System is a comprehensive solution for controlling access to different functionalities based on the current phase of the counselling process.

### Overview

The stage management system consists of several key components:

1. **StageManagement.tsx** - Main page for managing stages
2. **StageAccessControl.tsx** - Reusable component for access control
3. **StageStatusIndicator.tsx** - Component for displaying current stage status
4. **stageService.ts** - Service layer for stage-related API calls

### Features

#### Stage Management Page (`/admin/stages`)

- **Overview Tab**: Shows current stage information, progress, and quick statistics
- **All Stages Tab**: Lists all configured stages with management controls
- **Statistics Tab**: Displays stage-related statistics and metrics
- **Timeline Tab**: Shows stage history and transitions

#### Key Functionality

1. **Stage Creation**: Create new stages with custom configurations
2. **Stage Activation/Deactivation**: Control which stage is currently active
3. **Stage Editing**: Modify existing stage configurations
4. **Stage Deletion**: Remove stages from the system
5. **Default Stage Initialization**: Set up predefined stages for the counselling process

#### Stage Types

- **Stage 1**: College Registration
- **Stage 2**: Student Registration  
- **Stage 3**: Application Processing
- **Stage 4**: Results and Allotment
- **Completed**: System completed

### Components

#### StageAccessControl

A reusable component that wraps content and checks if it should be accessible based on the current stage.

```tsx
<StageAccessControl 
  requiredRole="college" 
  requiredAction="college_registration"
  fallback={<div>Registration not available</div>}
>
  <RegistrationForm />
</StageAccessControl>
```

#### StageStatusIndicator

Displays current stage information in various formats:

```tsx
// Minimal variant for headers
<StageStatusIndicator variant="minimal" />

// Compact variant for dashboards
<StageStatusIndicator variant="compact" showProgress={true} />

// Detailed variant for full information
<StageStatusIndicator variant="detailed" showActions={true} />
```

### API Integration

The system integrates with the following API endpoints:

- `GET /api/v1/stages/` - Get all stages
- `GET /api/v1/stages/current` - Get current stage information
- `POST /api/v1/stages/` - Create new stage
- `PUT /api/v1/stages/{id}` - Update stage
- `POST /api/v1/stages/{id}/activate` - Activate stage
- `POST /api/v1/stages/{id}/deactivate` - Deactivate stage
- `POST /api/v1/stages/initialize` - Initialize default stages
- `GET /api/v1/stages/check-registration/{role}` - Check registration status

### Usage Examples

#### Protecting Registration Forms

```tsx
import StageAccessControl from '@/components/common/StageAccessControl';

const CollegeRegistration = () => {
  return (
    <StageAccessControl 
      requiredRole="college" 
      requiredAction="college_registration"
      fallback={
        <div className="text-center p-8">
          <h3>Registration Not Available</h3>
          <p>College registration is not currently open.</p>
        </div>
      }
    >
      <CollegeRegistrationForm />
    </StageAccessControl>
  );
};
```

#### Using Stage Status in Headers

```tsx
import StageStatusIndicator from '@/components/common/StageStatusIndicator';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>TNEA Counselling</h1>
      <StageStatusIndicator variant="minimal" />
    </header>
  );
};
```

#### Checking Stage Access Programmatically

```tsx
import { useStageAccess, checkRegistrationAllowed } from '@/components/common/StageAccessControl';

const MyComponent = () => {
  const { isAllowed, isLoading, currentStage } = useStageAccess('college', 'college_registration');
  
  const handleRegistration = async () => {
    const canRegister = await checkRegistrationAllowed('college');
    if (canRegister) {
      // Proceed with registration
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAllowed) return <div>Access denied</div>;
  
  return <div>Registration form</div>;
};
```

### Configuration

#### Stage Configuration

Each stage can be configured with:

- **Stage Type**: The type of stage (stage_1, stage_2, etc.)
- **Name**: Human-readable name
- **Description**: Detailed description
- **Start/End Dates**: Time period for the stage
- **Allowed Roles**: Which user roles can access this stage
- **Blocked Endpoints**: API endpoints to block during this stage
- **Required Permissions**: Additional permissions needed

#### Default Stage Setup

The system includes a "Initialize Default Stages" feature that creates the standard counselling stages:

1. College Registration (Stage 1)
2. Student Registration (Stage 2)
3. Application Processing (Stage 3)
4. Results and Allotment (Stage 4)
5. System Completed

### Security Considerations

- Only administrators can access stage management
- Stage changes are logged for audit purposes
- Access control is enforced at both frontend and backend
- Stage transitions require confirmation for critical changes

### Best Practices

1. **Plan Stage Transitions**: Coordinate stage changes with stakeholders
2. **Monitor Progress**: Regularly check stage statistics and progress
3. **Communicate Changes**: Notify users about stage transitions
4. **Test Access Control**: Verify that access restrictions work correctly
5. **Backup Configurations**: Keep backups of stage configurations

### Troubleshooting

#### Common Issues

1. **Stage Not Activating**: Check if another stage is currently active
2. **Access Denied Unexpectedly**: Verify current stage allows the required role/action
3. **API Errors**: Check network connectivity and API endpoint availability

#### Debug Information

Enable debug logging to track stage-related issues:

```tsx
// In development, you can log stage information
console.log('Current stage:', currentStage);
console.log('Access check:', { requiredRole, requiredAction, isAllowed });
```

### Future Enhancements

- Automated stage transitions based on time or conditions
- Advanced analytics and reporting for stage performance
- Integration with notification systems for stage changes
- Calendar integration for stage scheduling
- Webhook support for stage events
