import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authService } from '@/services/auth/authService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'password' | 'success'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) return { isValid: false, error: 'Email is required' };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
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

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const emailValidation = validateEmail(value);
    setEmailError(emailValidation.error);
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value && newPassword !== value) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error);
      return;
    }

    setIsLoading(true);

    try {
      await authService.verifyEmailForReset(email);
      
      // If successful, move to password step
      setStep('password');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to verify email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setConfirmPasswordError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return;
    }

    const passwordValidation = validatePassword(newPassword);
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
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(email, newPassword);
      
      // If successful, move to success step
      setStep('success');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (step === 'email') {
        handleEmailSubmit(e as React.FormEvent);
      } else if (step === 'password') {
        handlePasswordSubmit(e as React.FormEvent);
      }
    }
  };

  // Success step
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Password Reset Successful</h1>
            <p className="text-muted-foreground mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Password reset step
  if (step === 'password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 shadow-xl">
          <div className="text-center mb-8">
            <Button variant="ghost" size="sm" className="absolute top-4 left-4" onClick={() => setStep('email')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Reset Your Password</h1>
              <p className="text-muted-foreground">
                Enter your new password for <strong>{email}</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your new password"
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Confirm your new password"
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
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Email step (default)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <Button variant="ghost" size="sm" className="absolute top-4 left-4" asChild>
            <Link to="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </Button>
          
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground">
              Enter your email address to reset your password.
            </p>
          </div>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-6">
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
                placeholder="Enter your email address"
                className={`w-full pl-10 ${emailError ? 'border-red-500 focus:border-red-500' : ''}`}
              />
            </div>
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
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
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{' '}
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

export default ForgotPassword; 