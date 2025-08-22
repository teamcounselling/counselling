import React from 'react';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/common/Navigation';
import { StatsCard } from '@/components/common/StatsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StudentHome: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', href: '/student', variant: 'student' as const },
    { label: 'Book Appointment', href: '/student/book', variant: 'student' as const },
    { label: 'My Profile', href: '/student/profile', variant: 'student' as const },
    { label: 'History', href: '/student/history', variant: 'student' as const },
    { label: 'Resources', href: '/student/resources', variant: 'student' as const },
  ];

  const upcomingAppointments = [
    { counselor: 'Dr. Sarah Johnson', type: 'Mental Health', date: 'Tomorrow', time: '2:00 PM' },
    { counselor: 'Prof. Mike Wilson', type: 'Academic', date: 'Friday', time: '10:00 AM' },
  ];

  const recentSessions = [
    { counselor: 'Dr. Emily Chen', type: 'Career Counseling', date: 'Last Monday', rating: 5 },
    { counselor: 'Dr. Sarah Johnson', type: 'Mental Health', date: '2 weeks ago', rating: 5 },
    { counselor: 'Prof. David Lee', type: 'Academic', date: '3 weeks ago', rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Student Dashboard" role="student" />
      <Navigation items={navItems} currentPath="/student" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-student-primary/10 to-student-light/10 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground mb-6">Ready to continue your counseling journey? Here's your dashboard overview.</p>
          <Button variant="student" size="lg">
            Book New Appointment
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Sessions Completed"
            value="12"
            description="This semester"
            trend="+3 from last month"
            variant="student"
            icon={<span className="text-xl">✅</span>}
          />
          <StatsCard
            title="Upcoming Sessions"
            value="2"
            description="Next 7 days"
            variant="student"
            icon={<span className="text-xl">📅</span>}
          />
          <StatsCard
            title="Wellness Score"
            value="8.5/10"
            description="Based on assessments"
            trend="Improving!"
            variant="student"
            icon={<span className="text-xl">🌟</span>}
          />
          <StatsCard
            title="Goals Achieved"
            value="7/10"
            description="This semester"
            trend="70% completion"
            variant="student"
            icon={<span className="text-xl">🎯</span>}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-foreground">Upcoming Appointments</h2>
              <Button variant="student" size="sm">View All</Button>
            </div>
            
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-student-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-student-primary font-medium">
                          {appointment.counselor.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{appointment.counselor}</p>
                        <p className="text-sm text-muted-foreground">{appointment.type}</p>
                        <p className="text-sm text-muted-foreground">{appointment.date} at {appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Reschedule</Button>
                      <Button variant="student" size="sm">Join</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button variant="student">Book Your First Session</Button>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="student" className="w-full justify-start">
                <span className="mr-3">📅</span>
                Book Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">💬</span>
                Message Counselor
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">📋</span>
                Complete Assessment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">📚</span>
                View Resources
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <span className="mr-3">⚙️</span>
                Update Profile
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Recent Sessions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {recentSessions.map((session, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-smooth">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-foreground">{session.counselor}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < session.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{session.type}</p>
                <p className="text-xs text-muted-foreground">{session.date}</p>
                <Button variant="ghost" size="sm" className="mt-2 w-full">
                  View Notes
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default StudentHome;