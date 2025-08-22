import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@counseling.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const { login, isLoading, bypassAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    const success = await login(email, password, 'admin');
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid credentials. Use admin@counseling.com / password');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-admin-primary/20 to-admin-light/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Login</h1>
          <p className="text-muted-foreground">Access the administrative dashboard</p>
          {bypassAuth && (
            <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning-foreground">Authentication is bypassed - click any button to enter</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="admin@counseling.com"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              className="w-full"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button
            variant="admin"
            size="lg"
            className="w-full"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-center">
            <Button variant="ghost" asChild>
              <a href="/">← Back to Home</a>
            </Button>
          </div>
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-medium text-foreground mb-2">Demo Credentials</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Email: admin@counseling.com</p>
            <p>Password: password</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;