import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface PersonalDetailsData {
  fullName: string;
  dateOfBirth: Date | null;
  gender: string;
  email: string;
  mobile: string;
  aadhaar: string;
}

interface PersonalDetailsStepProps {
  data: PersonalDetailsData;
  onUpdate: (data: Partial<PersonalDetailsData>) => void;
}

export const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            placeholder="Enter your full name as per official documents"
            className="focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label>
            Date of Birth <span className="text-destructive">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.dateOfBirth ? (
                  format(data.dateOfBirth, "PPP")
                ) : (
                  <span>Pick your date of birth</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.dateOfBirth || undefined}
                onSelect={(date) => onUpdate({ dateOfBirth: date || null })}
                disabled={(date) =>
                  date > new Date() || date < new Date("1990-01-01")
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>
            Gender <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={data.gender}
            onValueChange={(value) => onUpdate({ gender: value })}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="your.email@example.com"
            className="focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="mobile"
            value={data.mobile}
            onChange={(e) => onUpdate({ mobile: e.target.value })}
            placeholder="10-digit mobile number"
            maxLength={10}
            className="focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="aadhaar">
            Aadhaar Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="aadhaar"
            value={data.aadhaar}
            onChange={(e) => onUpdate({ aadhaar: e.target.value })}
            placeholder="12-digit Aadhaar number"
            maxLength={12}
            className="focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="text-destructive">*</span> All fields marked with an asterisk are mandatory. 
          Please ensure all information matches your official documents.
        </p>
      </div>
    </div>
  );
};