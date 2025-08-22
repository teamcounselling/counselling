# Services Documentation

This directory contains all the API services for the Triad Counsel application. The services are organized by user type and include automatic token management.

## Structure

```
services/
├── apiClient.ts          # Axios instance with interceptors
├── auth/
│   └── authService.ts    # Authentication service
├── admin/
│   └── adminService.ts   # Admin-specific operations
├── college/
│   └── collegeService.ts # College-specific operations
├── student/
│   └── studentService.ts # Student-specific operations
└── index.ts              # Exports all services and types
```

## Setup

1. Install axios if not already installed:
```bash
npm install axios
```

2. Import services in your components:
```typescript
import { authService, adminService, collegeService, studentService } from '../services';
```

## API Client

The `apiClient.ts` provides a configured axios instance with:

- **Base URL**: `http://localhost:8000/api/v1`
- **Request Interceptor**: Automatically adds Bearer token to all requests
- **Response Interceptor**: Handles 401 errors by refreshing tokens automatically

## Authentication Service

Handles login, logout, and token management.

```typescript
// Login
const response = await authService.login({
  email: "college@agilecyber.com",
  password: "Acs@2025"
});

// Check if user is authenticated
const isAuth = authService.isAuthenticated();

// Get current user
const user = authService.getCurrentUser();

// Logout
await authService.logout();
```

## Admin Service

Provides admin-specific operations for user and college management.

```typescript
// Get all users
const users = await adminService.getAllUsers();

// Get dashboard statistics
const stats = await adminService.getDashboardStats();

// Approve college
await adminService.approveCollege(collegeId);
```

## College Service

Handles college-specific operations like program and student management.

```typescript
// Get college profile
const profile = await collegeService.getProfile();

// Create program
const program = await collegeService.createProgram({
  name: "Computer Science",
  description: "BS in Computer Science",
  duration: "4 years",
  fee_structure: "50000 per year"
});

// Get all students
const students = await collegeService.getAllStudents();
```

## Student Service

Manages student-specific operations like enrollment and appointments.

```typescript
// Get student profile
const profile = await studentService.getProfile();

// Browse programs
const programs = await studentService.getAllPrograms();

// Enroll in program
const enrollment = await studentService.enrollInProgram(programId);

// Book appointment with counselor
const appointment = await studentService.createAppointment({
  counselor_id: 1,
  date: "2024-01-15",
  time: "10:00",
  notes: "Career guidance session"
});
```

## Token Management

The system automatically handles:

1. **Access Token**: Added to all API requests
2. **Token Refresh**: Automatically refreshes expired tokens
3. **Logout**: Clears all tokens on logout or refresh failure

### Token Storage

Tokens are stored in localStorage:
- `access_token`: JWT access token
- `refresh_token`: JWT refresh token
- `user`: Current user information

### Automatic Refresh

When a request returns 401 (Unauthorized):
1. The system attempts to refresh the token
2. If successful, retries the original request
3. If failed, redirects to login page

## Error Handling

All services include proper error handling:

```typescript
try {
  const data = await authService.login(credentials);
  // Handle success
} catch (error) {
  // Handle error
  console.error('Login failed:', error);
}
```

## TypeScript Support

All services include TypeScript interfaces for:
- Request/Response types
- Entity models
- API responses

Import types as needed:

```typescript
import type { LoginRequest, User, Program } from '../services';
```

## Usage Examples

### Login Component
```typescript
import { authService } from '../services';

const handleLogin = async (credentials: LoginRequest) => {
  try {
    const response = await authService.login(credentials);
    // Redirect based on user role
    const role = response.user.role;
    if (role === 1) {
      navigate('/college/home');
    } else if (role === 2) {
      navigate('/student/home');
    }
  } catch (error) {
    // Handle error
  }
};
```

### Protected Route Component
```typescript
import { authService } from '../services';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};
```

### Dashboard Component
```typescript
import { collegeService } from '../services';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await collegeService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    
    loadStats();
  }, []);
  
  // Render dashboard
};
``` 