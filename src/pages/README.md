# Authentication Pages

## Overview
The authentication system includes three main pages for user authentication and account management:

### Login Page (`src/pages/Login.tsx`)
Provides a unified authentication interface for all user types in the counseling platform.

### Register Page (`src/pages/Register.tsx`)
Allows new users to create accounts with role selection.

### Forgot Password Page (`src/pages/ForgotPassword.tsx`)
Enables users to reset their passwords via email.

## Features

### Login Page Features
- **API Integration**: Uses actual authentication service with proper error handling
- **Multi-Role Support**: Student, College, and Admin authentication based on API response
- **Enhanced UI**: Icons, remember me checkbox, and forgot password link
- **Password Visibility Toggle**: Show/hide password with eye icon
- **Form Validation**: Ensures both email and password are provided
- **Loading States**: Visual feedback during authentication
- **Error Handling**: Clear error messages for failed login attempts with specific API error codes
- **Navigation Links**: Easy access to registration and forgot password
- **Auto-Navigation**: Automatically redirects to appropriate portal based on user role

### Register Page Features
- **Comprehensive Form**: First name, last name, email, password, and role selection
- **Role Selection**: Choose between Student and College/Institution accounts
- **Password Validation**: Minimum 8 characters and confirmation matching
- **Email Validation**: Proper email format verification
- **Success State**: Confirmation screen with navigation options
- **Form Validation**: Complete validation with helpful error messages

### Forgot Password Features
- **Email Input**: Simple email address collection
- **Success State**: Confirmation screen with email sent message
- **Navigation**: Easy access back to login page
- **Loading States**: Visual feedback during submission
- **Error Handling**: Validation and error display

## Demo Credentials

### Student
- Email: `student@university.edu`
- Password: `password`

### College
- Email: `college@university.edu`
- Password: `password`

### Admin
- Email: `admin@counseling.com`
- Password: `password`

## Usage

### Login Flow
1. Navigate to `/login` or click any portal button on the landing page
2. Enter your email and password
3. Optionally check "Remember me" and use "Forgot password?" if needed
4. Click "Sign In" to authenticate
5. You'll be redirected to the appropriate portal dashboard

### Registration Flow
1. Navigate to `/register` or click "Sign up" on the login page
2. Fill in all required fields (first name, last name, email, password)
3. Select your account type (Student or College/Institution)
4. Confirm your password
5. Click "Create Account" to register
6. You'll see a success message and can navigate to login

### Forgot Password Flow
1. Navigate to `/forgot-password` or click "Forgot password?" on the login page
2. Enter your email address
3. Click "Send Reset Link" to request password reset
4. You'll see a confirmation message with instructions
5. Check your email for the reset link

## Technical Details

### Components Used
- `Button`, `Input`, `Card`, `Select` from shadcn/ui
- `ArrowLeft`, `Eye`, `EyeOff`, `Mail`, `Lock`, `User`, `CheckCircle` icons from Lucide React

### State Management
- Uses `useAuth` hook from `AuthContext`
- Manages form state with React hooks
- Handles loading and error states
- Integrates with `authService` for API calls
- Automatic user role detection and navigation

### Routing
- Integrated with React Router
- Role-based navigation after successful login
- Seamless navigation between login, register, and forgot password pages
- Back navigation to landing page

## Styling
- Uses Tailwind CSS for responsive design
- Role-specific button variants (student, college, admin)
- Consistent with the overall application theme
- Gradient backgrounds and modern card design 