import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Edit, FileText, User, MapPin, Users, GraduationCap, Target, Heart, Eye, Send } from 'lucide-react';
import { PersonalDetailsStep } from './steps/PersonalDetailsStep';
import { AddressInformationStep } from './steps/AddressInformationStep';
import { CommunityDetailsStep } from './steps/CommunityDetailsStep';
import { AcademicDetailsStep } from './steps/AcademicDetailsStep';
import { MarksDetailsStep } from './steps/MarksDetailsStep';
import { CollegePreferencesStep } from './steps/CollegePreferencesStep';
import { DeclarationStep } from './steps/DeclarationStep';
import { PreviewStep } from './steps/PreviewStep';

export interface FormData {
  personal_details: {
    fullName: string;
    dateOfBirth: Date | null;
    gender: string;
    email: string;
    mobile: string;
    aadhaar: string;
  };
  address_info: {
    permanentAddress: string;
    state: string;
    district: string;
    pincode: string;
  };
  community_info: {
    community: string;
    casteName: string;
    communityFile: File | null;
    specialCategories: string[];
  };
  academic_details: {
    tenth: {
      marksheetNumber: string;
      school: string;
      board: string;
      year: string;
    };
    twelfth: {
      marksheetNumber: string;
      school: string;
      board: string;
      year: string;
    };
    marksheetFiles: File[];
  };
  marks: {
    maths: string;
    physics: string;
    chemistry: string;
    cutoff: string;
    combinedMarksheetFile: File | null;
  };
  preferences: {
    colleges: string[];
    branches: string[];
  };
  declaration: {
    agreed: boolean;
    signatureFile: File | null;
  };
}

const initialFormData: FormData = {
  personal_details: {
    fullName: '',
    dateOfBirth: null,
    gender: '',
    email: '',
    mobile: '',
    aadhaar: '',
  },
  address_info: {
    permanentAddress: '',
    state: '',
    district: '',
    pincode: '',
  },
  community_info: {
    community: '',
    casteName: '',
    communityFile: null,
    specialCategories: [],
  },
  academic_details: {
    tenth: {
      marksheetNumber: '',
      school: '',
      board: '',
      year: '',
    },
    twelfth: {
      marksheetNumber: '',
      school: '',
      board: '',
      year: '',
    },
    marksheetFiles: [],
  },
  marks: {
    maths: '',
    physics: '',
    chemistry: '',
    cutoff: '',
    combinedMarksheetFile: null,
  },
  preferences: {
    colleges: [],
    branches: [],
  },
  declaration: {
    agreed: false,
    signatureFile: null,
  },
};

const steps = [
  { id: 1, title: 'Personal Details', icon: User, description: 'Basic information' },
  { id: 2, title: 'Address Info', icon: MapPin, description: 'Contact details' },
  { id: 3, title: 'Community', icon: Users, description: 'Category details' },
  { id: 4, title: 'Academic', icon: GraduationCap, description: 'Educational background' },
  { id: 5, title: 'Marks', icon: Target, description: 'Score details' },
  { id: 6, title: 'Preferences', icon: Heart, description: 'College choices' },
  { id: 7, title: 'Declaration', icon: FileText, description: 'Consent & signature' },
  { id: 8, title: 'Preview', icon: Eye, description: 'Review & submit' },
];

export const TNEARegistrationForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const handleSaveDraft = () => {
    localStorage.setItem('tnea_draft', JSON.stringify(formData));
    // Show toast notification
  };

  const handleSubmit = async () => {
    try {
      // Final submission logic
      console.log('Submitting form data:', formData);
      // Add API call here
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsStep data={formData.personal_details} onUpdate={(data) => updateFormData('personal_details', data)} />;
      case 2:
        return <AddressInformationStep data={formData.address_info} onUpdate={(data) => updateFormData('address_info', data)} />;
      case 3:
        return <CommunityDetailsStep data={formData.community_info} onUpdate={(data) => updateFormData('community_info', data)} />;
      case 4:
        return <AcademicDetailsStep data={formData.academic_details} onUpdate={(data) => updateFormData('academic_details', data)} />;
      case 5:
        return <MarksDetailsStep data={formData.marks} onUpdate={(data) => updateFormData('marks', data)} />;
      case 6:
        return <CollegePreferencesStep data={formData.preferences} onUpdate={(data) => updateFormData('preferences', data)} />;
      case 7:
        return <DeclarationStep data={formData.declaration} onUpdate={(data) => updateFormData('declaration', data)} />;
      case 8:
        return <PreviewStep formData={formData} onEdit={handleStepClick} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  const progressValue = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-form-header to-primary p-6 rounded-t-lg text-white mb-6">
          <div className="flex items-center gap-4">
            <GraduationCap className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Tamil Nadu Engineering Admissions (TNEA)</h1>
              <p className="text-primary-foreground/90">Student Registration Form 2024-25</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6 shadow-form">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">Progress</span>
                <span className="text-sm font-medium text-primary">{Math.round(progressValue)}% Complete</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.includes(step.id);
                const isActive = currentStep === step.id;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      isActive
                        ? 'border-form-step-active bg-primary/10 shadow-step'
                        : isCompleted
                        ? 'border-form-step-completed bg-success/10'
                        : 'border-form-step-inactive bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className={`p-2 rounded-full ${
                        isActive
                          ? 'bg-form-step-active text-white'
                          : isCompleted
                          ? 'bg-form-step-completed text-white'
                          : 'bg-form-step-inactive text-white'
                      }`}>
                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <div className="text-center">
                        <div className={`text-xs font-medium ${
                          isActive ? 'text-form-step-active' : isCompleted ? 'text-form-step-completed' : 'text-form-step-inactive'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground hidden md:block">
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Form Content */}
        <Card className="shadow-form mb-6">
          <CardHeader className="bg-gradient-to-r from-accent to-muted">
            <CardTitle className="flex items-center gap-2">
              {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
              Step {currentStep}: {steps[currentStep - 1].title}
              <Badge variant="outline" className="ml-auto">
                {currentStep} of {steps.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  className="border-warning text-warning hover:bg-warning hover:text-warning-foreground"
                >
                  Save Draft
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep === steps.length ? (
                  <Button
                    onClick={handleSubmit}
                    className="bg-success hover:bg-success/90 text-success-foreground"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary-glow"
                  >
                    Next Step
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};