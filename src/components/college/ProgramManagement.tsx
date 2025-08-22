import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Program {
  id: string;
  name: string;
  description: string;
  students: number;
  counselors: number;
  status: 'active' | 'inactive';
  satisfaction: number;
}

const mockPrograms: Program[] = [
  {
    id: '1',
    name: 'Mental Health Support',
    description: 'Comprehensive mental health counseling and support services',
    students: 45,
    counselors: 8,
    status: 'active',
    satisfaction: 4.8
  },
  {
    id: '2',
    name: 'Career Development',
    description: 'Professional career guidance and development programs',
    students: 32,
    counselors: 5,
    status: 'active',
    satisfaction: 4.6
  },
  {
    id: '3',
    name: 'Academic Support',
    description: 'Academic counseling and study skills development',
    students: 28,
    counselors: 6,
    status: 'active',
    satisfaction: 4.7
  },
  {
    id: '4',
    name: 'Peer Mentoring',
    description: 'Student-to-student mentoring and support network',
    students: 15,
    counselors: 3,
    status: 'inactive',
    satisfaction: 4.2
  }
];

export const ProgramManagement: React.FC = () => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Program Management</h2>
        <Button variant="college">Create New Program</Button>
      </div>
      
      <div className="grid gap-6">
        {mockPrograms.map((program) => (
          <Card key={program.id} className="p-6 border-2 hover:shadow-md transition-smooth">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">{program.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    program.status === 'active' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {program.status}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{program.description}</p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Students Enrolled</p>
                    <p className="text-xl font-bold text-foreground">{program.students}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Counselors Assigned</p>
                    <p className="text-xl font-bold text-foreground">{program.counselors}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Satisfaction Score</p>
                    <p className="text-xl font-bold text-foreground">{program.satisfaction}/5</p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="college" size="sm">View Details</Button>
                <Button 
                  variant={program.status === 'active' ? 'destructive' : 'success'} 
                  size="sm"
                >
                  {program.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Capacity</span>
                <span>{program.students}/50</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-college-primary h-2 rounded-full transition-smooth"
                  style={{ width: `${(program.students / 50) * 100}%` }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};