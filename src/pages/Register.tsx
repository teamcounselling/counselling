import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, CheckCircle, Phone } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student' as 'student' | 'college'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ [key: string]: boolean }>({});
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const { register: registerUser, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  // Navigate after successful registration
  useEffect(() => {
    if (user) {
      const roleRoutes = {
        admin: '/admin',
        student: '/student',
        college: '/college'
      };
      const route = roleRoutes[user.role];
      if (route) {
        navigate(route);
      }
    }
  }, [user, navigate]);

  const validateEmail = (email: string) => {
    if (!email) return { isValid: false, error: 'Email is required' };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    // Check for common email format issues
    if (email.includes('..')) {
      return { isValid: false, error: 'Email cannot contain consecutive dots' };
    }
    
    if (email.startsWith('.') || email.endsWith('.')) {
      return { isValid: false, error: 'Email cannot start or end with a dot' };
    }
    
    if (email.length > 254) {
      return { isValid: false, error: 'Email is too long' };
    }
    
    return { isValid: true, error: '' };
  };

  const validatePassword = (password: string) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)
    };

    const failedRules = Object.entries(rules)
      .filter(([_, passed]) => !passed)
      .map(([rule]) => rule);

    return { isValid: failedRules.length === 0, failedRules };
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) strength += 1;
    
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 1) return 'Very Weak';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Update password strength when password field changes
    if (field === 'password') {
      const validation = validatePassword(value);
      const strengthMap = {
        length: validation.failedRules.includes('length') ? false : true,
        uppercase: validation.failedRules.includes('uppercase') ? false : true,
        lowercase: validation.failedRules.includes('lowercase') ? false : true,
        digit: validation.failedRules.includes('digit') ? false : true,
        special: validation.failedRules.includes('special') ? false : true
      };
      setPasswordStrength(strengthMap);
    }

    // Validate confirm password in real-time
    if (field === 'confirmPassword') {
      if (value && formData.password !== value) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }

    // Also validate when password changes
    if (field === 'password') {
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }

    // Validate email in real-time
    if (field === 'email') {
      const emailValidation = validateEmail(value);
      setEmailError(emailValidation.error);
    }
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      const ruleMessages = {
        length: 'at least 8 characters',
        uppercase: 'one uppercase letter',
        lowercase: 'one lowercase letter',
        digit: 'one number',
        special: 'one special character'
      };
      
      const failedMessages = passwordValidation.failedRules.map(rule => ruleMessages[rule as keyof typeof ruleMessages]);
      setError(`Password must contain: ${failedMessages.join(', ')}`);
      return false;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setError(emailValidation.error);
      return false;
    }

    // Basic phone validation
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      // Convert role string to number
      const roleMap = {
        student: 2,
        college: 3
      };

      const userData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        role: roleMap[formData.role]
      };

      const success = await registerUser(userData);
      if (success) {
        setIsSubmitted(true);
      }
         } catch (error) {
       if (error instanceof Error) {
         setError(error.message);
       } else {
         setError('Registration failed. Please try again.');
       }
     }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as React.FormEvent);
    }
  };

  // If user is logged in, they will be automatically navigated by the useEffect
  // No need for success screen as registration will auto-login the user

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 shadow-xl">
        <div className="text-center mb-8">
          <Button variant="ghost" size="sm" className="absolute top-4 left-4" asChild>
            <Link to="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </Button>
          
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join our counseling platform and get started today.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="First name"
                  className="w-full pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Last name"
                  className="w-full pl-10"
                />
              </div>
            </div>
          </div>

                     <div>
             <label className="block text-sm font-medium text-foreground mb-2">
               Email Address
             </label>
             <div className="relative">
               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 type="email"
                 value={formData.email}
                 onChange={(e) => handleInputChange('email', e.target.value)}
                 placeholder="Enter your email"
                 className={`w-full pl-10 ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
               />
             </div>
             {emailError && (
               <p className="text-sm text-red-500 mt-1">{emailError}</p>
             )}
           </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                className="w-full pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Account Type
            </label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange('role', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="college">College/Institution</SelectItem>
              </SelectContent>
            </Select>
          </div>

                     <div>
             <label className="block text-sm font-medium text-foreground mb-2">
               Password
             </label>
             <div className="relative">
               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 type={showPassword ? "text" : "password"}
                 value={formData.password}
                 onChange={(e) => handleInputChange('password', e.target.value)}
                 onFocus={() => setIsPasswordFocused(true)}
                 onBlur={() => setIsPasswordFocused(false)}
                 placeholder="Create a password"
                 className="w-full pl-10 pr-10"
               />
               <Button
                 type="button"
                 variant="ghost"
                 size="sm"
                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                 onClick={() => setShowPassword(!showPassword)}
               >
                 {showPassword ? (
                   <EyeOff className="h-4 w-4" />
                 ) : (
                   <Eye className="h-4 w-4" />
                 )}
               </Button>
             </div>
             
             {/* Password Strength Meter */}
             {formData.password && (
               <div className="mt-2">
                 <div className="flex items-center justify-between mb-1">
                   <span className="text-xs text-muted-foreground">Password strength:</span>
                   <span className={`text-xs font-medium ${getStrengthColor(getPasswordStrength(formData.password)).replace('bg-', 'text-')}`}>
                     {getStrengthText(getPasswordStrength(formData.password))}
                   </span>
                 </div>
                 <div className="w-full bg-gray-200 rounded-full h-2">
                   <div
                     className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(getPasswordStrength(formData.password))}`}
                     style={{ width: `${(getPasswordStrength(formData.password) / 5) * 100}%` }}
                   ></div>
                 </div>
               </div>
             )}
             
             {/* Password Requirements - Only show when focused */}
             {isPasswordFocused && formData.password && (
               <div className="mt-2 space-y-1">
                 <p className="text-xs text-muted-foreground mb-2">Password requirements:</p>
                 <div className="space-y-1">
                   <div className={`flex items-center text-xs ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                     <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                     At least 8 characters
                   </div>
                   <div className={`flex items-center text-xs ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                     <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.uppercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                     One uppercase letter
                   </div>
                   <div className={`flex items-center text-xs ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                     <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.lowercase ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                     One lowercase letter
                   </div>
                   <div className={`flex items-center text-xs ${passwordStrength.digit ? 'text-green-600' : 'text-gray-500'}`}>
                     <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.digit ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                     One number
                   </div>
                   <div className={`flex items-center text-xs ${passwordStrength.special ? 'text-green-600' : 'text-gray-500'}`}>
                     <div className={`w-2 h-2 rounded-full mr-2 ${passwordStrength.special ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                     One special character
                   </div>
                 </div>
               </div>
             )}
           </div>

                     <div>
             <label className="block text-sm font-medium text-foreground mb-2">
               Confirm Password
             </label>
             <div className="relative">
               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 type={showConfirmPassword ? "text" : "password"}
                 value={formData.confirmPassword}
                 onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                 placeholder="Confirm your password"
                 className={`w-full pl-10 pr-10 ${confirmPasswordError ? 'border-red-500 focus:border-red-500' : ''}`}
               />
               <Button
                 type="button"
                 variant="ghost"
                 size="sm"
                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
               >
                 {showConfirmPassword ? (
                   <EyeOff className="h-4 w-4" />
                 ) : (
                   <Eye className="h-4 w-4" />
                 )}
               </Button>
             </div>
             {confirmPasswordError && (
               <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>
             )}
           </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={authLoading}
          >
            {authLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register; 