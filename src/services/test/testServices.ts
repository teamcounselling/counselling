// This file demonstrates how to use the services
// You can run these functions to test the API integration

import { 
  authService, 
  adminService, 
  collegeService, 
  studentService,
  LoginRequest 
} from '../index';

// Test authentication
export const testAuth = async () => {
  console.log('Testing Authentication Service...');
  
  try {
    // Test login
    const credentials: LoginRequest = {
      email: 'college@agilecyber.com',
      password: 'Acs@2025'
    };
    
    const loginResponse = await authService.login(credentials);
    console.log('Login successful:', loginResponse);
    
    // Test getting current user
    const currentUser = authService.getCurrentUser();
    console.log('Current user:', currentUser);
    
    // Test checking authentication
    const isAuth = authService.isAuthenticated();
    console.log('Is authenticated:', isAuth);
    
    // Test getting user role
    const role = authService.getUserRole();
    console.log('User role:', role);
    
  } catch (error) {
    console.error('Auth test failed:', error);
  }
};

// Test admin service (requires admin role)
export const testAdminService = async () => {
  console.log('Testing Admin Service...');
  
  try {
    // Get dashboard stats
    const stats = await adminService.getDashboardStats();
    console.log('Dashboard stats:', stats);
    
    // Get all users
    const users = await adminService.getAllUsers();
    console.log('All users:', users);
    
  } catch (error) {
    console.error('Admin service test failed:', error);
  }
};

// Test college service (requires college role)
export const testCollegeService = async () => {
  console.log('Testing College Service...');
  
  try {
    // Get college profile
    const profile = await collegeService.getProfile();
    console.log('College profile:', profile);
    
    // Get dashboard stats
    const stats = await collegeService.getDashboardStats();
    console.log('College dashboard stats:', stats);
    
    // Get all programs
    const programs = await collegeService.getAllPrograms();
    console.log('College programs:', programs);
    
  } catch (error) {
    console.error('College service test failed:', error);
  }
};

// Test student service (requires student role)
export const testStudentService = async () => {
  console.log('Testing Student Service...');
  
  try {
    // Get student profile
    const profile = await studentService.getProfile();
    console.log('Student profile:', profile);
    
    // Get dashboard stats
    const stats = await studentService.getDashboardStats();
    console.log('Student dashboard stats:', stats);
    
    // Get all programs
    const programs = await studentService.getAllPrograms();
    console.log('Available programs:', programs);
    
  } catch (error) {
    console.error('Student service test failed:', error);
  }
};

// Test token refresh
export const testTokenRefresh = async () => {
  console.log('Testing Token Refresh...');
  
  try {
    const response = await authService.refreshToken();
    console.log('Token refresh successful:', response);
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
};

// Test logout
export const testLogout = async () => {
  console.log('Testing Logout...');
  
  try {
    await authService.logout();
    console.log('Logout successful');
    
    const isAuth = authService.isAuthenticated();
    console.log('Is authenticated after logout:', isAuth);
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Run all tests
export const runAllTests = async () => {
  console.log('=== Starting Service Tests ===');
  
  await testAuth();
  await testCollegeService();
  await testStudentService();
  await testAdminService();
  await testTokenRefresh();
  await testLogout();
  
  console.log('=== Service Tests Complete ===');
};

// Usage example:
// In your browser console or a test file:
// import { runAllTests } from './services/test/testServices';
// runAllTests(); 