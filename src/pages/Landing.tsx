import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';

const Landing: React.FC = () => {
  const roles = [
    {
      title: 'Admin Portal',
      description: 'Manage users, system settings, and oversee all counseling services.',
      href: '/login',
      variant: 'admin' as const,
      features: ['User Management', 'System Analytics', 'Configuration', 'Reports']
    },
    {
      title: 'Student Portal',
      description: 'Access counseling services, book appointments, and manage your profile.',
      href: '/login',
      variant: 'student' as const,
      features: ['Book Appointments', 'Profile Management', 'Counseling History', 'Resources']
    },
    {
      title: 'College Portal',
      description: 'Manage programs, view applications, and coordinate counseling services.',
      href: '/login',
      variant: 'college' as const,
      features: ['Program Management', 'Student Applications', 'Counselor Assignment', 'Analytics']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header title="Counseling Services Platform" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Welcome to <span className="bg-gradient-primary bg-clip-text text-transparent">CounselingHub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A comprehensive platform connecting students with professional counseling services. 
            Access mental health support, academic guidance, and career counseling all in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="hero" size="xl">
              Get Started
            </Button>
            <Button variant="outline" size="xl">
              Learn More
            </Button>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {roles.map((role) => (
            <Card key={role.title} className="p-8 hover:shadow-xl transition-smooth border-2 hover:border-primary/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-3">{role.title}</h3>
                <p className="text-muted-foreground mb-6">{role.description}</p>
                
                <div className="space-y-2 mb-6">
                  {role.features.map((feature) => (
                    <div key={feature} className="flex items-center justify-center text-sm text-muted-foreground">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button
                  variant={role.variant}
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <a href={role.href}>Login to {role.title}</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-card rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Comprehensive Counseling Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Mental Health</h3>
              <p className="text-sm text-muted-foreground">Professional mental health support and therapy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Academic Guidance</h3>
              <p className="text-sm text-muted-foreground">Educational planning and academic support</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Career Counseling</h3>
              <p className="text-sm text-muted-foreground">Professional career development and planning</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Group Sessions</h3>
              <p className="text-sm text-muted-foreground">Peer support and group therapy sessions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;