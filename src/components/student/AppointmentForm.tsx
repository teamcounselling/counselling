import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Counselor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
}

const mockCounselors: Counselor[] = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Mental Health', available: true },
  { id: '2', name: 'Prof. Mike Wilson', specialty: 'Academic', available: true },
  { id: '3', name: 'Dr. Emily Chen', specialty: 'Career Counseling', available: false },
];

export const AppointmentForm: React.FC = () => {
  const [selectedCounselor, setSelectedCounselor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    // Handle appointment booking
    console.log('Booking appointment:', { selectedCounselor, selectedDate, selectedTime, notes });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">Book New Appointment</h2>
      
      <div className="space-y-6">
        {/* Counselor Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Counselor
          </label>
          <div className="grid gap-3">
            {mockCounselors.map((counselor) => (
              <div
                key={counselor.id}
                className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
                  selectedCounselor === counselor.id 
                    ? 'border-student-primary bg-student-primary/5' 
                    : 'border-border hover:border-student-primary/50'
                } ${!counselor.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => counselor.available && setSelectedCounselor(counselor.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{counselor.name}</p>
                    <p className="text-sm text-muted-foreground">{counselor.specialty}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    counselor.available 
                      ? 'bg-success/10 text-success' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {counselor.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Preferred Date
          </label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Preferred Time
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'].map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? 'student' : 'outline'}
                size="sm"
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            className="w-full p-3 border border-input rounded-md bg-background text-foreground"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any specific concerns or topics you'd like to discuss..."
          />
        </div>

        <Button
          variant="student"
          size="lg"
          className="w-full"
          onClick={handleSubmit}
          disabled={!selectedCounselor || !selectedDate || !selectedTime}
        >
          Book Appointment
        </Button>
      </div>
    </Card>
  );
};