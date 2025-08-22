import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  // Role will be determined by the API response
  const { login, isLoading, bypassAuth, user, toggleBypass } = useAuth();
  const navigate = useNavigate();

  // Navigate after successful login
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

  const handleLogin = async () => {
    setError('');
    setEmailError('');
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        console.log('Login successful');
        // Navigate based on user role from context
        // This will be handled by the AuthContext user state
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        // Clear email error if it's an API error (not validation error)
        if (!emailError) {
          setEmailError('');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const emailValidation = validateEmail(value);
    setEmailError(emailValidation.error);
  };

  const fillDemoCredentials = () => {
    // Use student credentials as default
    setEmail('student@university.edu');
    setPassword('password');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <Button variant="ghost" size="sm" className="absolute top-4 left-4" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your portal</p>
            
            {/* Development Mode Toggle */}
            
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onKeyPress={handleKeyPress}
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
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
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
          </div>

          <div className="flex items-center justify-end">
            
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

                                <Button
             variant="default"
             size="lg"
             className="w-full"
             onClick={handleLogin}
             disabled={isLoading}
           >
             {isLoading ? 'Signing In...' : 'Sign In'}
           </Button>

           <div className="text-center">
             <p className="text-sm text-muted-foreground">
               Don't have an account?{' '}
               <Link
                 to="/register"
                 className="text-primary hover:text-primary/80 transition-colors font-medium"
               >
                 Sign up
               </Link>
             </p>
                      </div>
         </div>
       </Card>
     </div>
   );
 };

export default Login; 