// Export all services
export { authService } from './auth/authService';
export { adminService } from './admin/adminService';
export { collegeService } from './college/collegeService';
export { studentService } from './student/studentService';
export { apiClient } from './apiClient';

// Export hooks
export { useAuth } from './hooks/useAuth';

// Export types
export type {
  LoginRequest,
  User,
  Tokens,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse
} from './auth/authService';

export type {
  AdminUser,
  College,
  Student,
  CreateUserRequest,
  UpdateUserRequest
} from './admin/adminService';

export type {
  CollegeProfile,
  Program,
  Course,
  Student as CollegeStudent,
  Appointment,
  UpdateProfileRequest,
  CreateProgramRequest,
  CreateCourseRequest,
  CreateAppointmentRequest
} from './college/collegeService';

export type {
  StudentProfile,
  Program as StudentProgram,
  Course as StudentCourse,
  Counselor,
  Appointment as StudentAppointment,
  CreateAppointmentRequest as StudentCreateAppointmentRequest,
  UpdateProfileRequest as StudentUpdateProfileRequest,
  Enrollment,
  CourseEnrollment
} from './student/studentService'; 