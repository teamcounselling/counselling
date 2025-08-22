import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Book } from 'lucide-react';

interface CollegePreferencesData {
  colleges: string[];
  branches: string[];
}

interface CollegePreferencesStepProps {
  data: CollegePreferencesData;
  onUpdate: (data: Partial<CollegePreferencesData>) => void;
}

const colleges = [
  'Anna University - CEG Campus',
  'MIT Campus - Anna University',
  'Thiagarajar College of Engineering',
  'PSG College of Technology',
  'Kumaraguru College of Technology',
  'SSN College of Engineering',
  'Velammal Engineering College',
  'SRM Institute of Science and Technology',
  'VIT Chennai',
  'Amrita School of Engineering',
  'Hindustan Institute of Technology',
  'Rajalakshmi Engineering College',
  'Panimalar Engineering College',
  'RMK Engineering College',
  'St. Joseph\'s College of Engineering'
];

const branches = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Aeronautical Engineering',
  'Automobile Engineering',
  'Biomedical Engineering',
  'Biotechnology',
  'Industrial Engineering',
  'Production Engineering',
  'Textile Technology',
  'Food Technology'
];

export const CollegePreferencesStep: React.FC<CollegePreferencesStepProps> = ({ data, onUpdate }) => {
  const handleCollegeChange = (college: string, checked: boolean) => {
    const updatedColleges = checked
      ? [...data.colleges, college]
      : data.colleges.filter(c => c !== college);
    onUpdate({ colleges: updatedColleges });
  };

  const handleBranchChange = (branch: string, checked: boolean) => {
    const updatedBranches = checked
      ? [...data.branches, branch]
      : data.branches.filter(b => b !== branch);
    onUpdate({ branches: updatedBranches });
  };

  return (
    <div className="space-y-6">
      {/* College Preferences */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Building className="h-5 w-5" />
            Preferred Colleges
            <Badge variant="secondary" className="ml-auto">
              {data.colleges.length} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>
              Select your preferred colleges (Choose multiple) <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mb-4">
              Select colleges in order of your preference. You can choose multiple options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
            {colleges.map((college) => (
              <div key={college} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <Checkbox
                  id={college}
                  checked={data.colleges.includes(college)}
                  onCheckedChange={(checked) => 
                    handleCollegeChange(college, checked as boolean)
                  }
                  className="mt-0.5"
                />
                <Label htmlFor={college} className="text-sm leading-relaxed cursor-pointer">
                  {college}
                </Label>
              </div>
            ))}
          </div>

          {data.colleges.length > 0 && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Selected Colleges:</h4>
              <div className="flex flex-wrap gap-2">
                {data.colleges.map((college, index) => (
                  <Badge key={college} variant="secondary" className="text-xs">
                    {index + 1}. {college}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branch Preferences */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Book className="h-5 w-5" />
            Preferred Branches
            <Badge variant="secondary" className="ml-auto">
              {data.branches.length} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>
              Select your preferred engineering branches <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose the engineering branches you are interested in studying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
            {branches.map((branch) => (
              <div key={branch} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <Checkbox
                  id={branch}
                  checked={data.branches.includes(branch)}
                  onCheckedChange={(checked) => 
                    handleBranchChange(branch, checked as boolean)
                  }
                  className="mt-0.5"
                />
                <Label htmlFor={branch} className="text-sm leading-relaxed cursor-pointer">
                  {branch}
                </Label>
              </div>
            ))}
          </div>

          {data.branches.length > 0 && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Selected Branches:</h4>
              <div className="flex flex-wrap gap-2">
                {data.branches.map((branch, index) => (
                  <Badge key={branch} variant="secondary" className="text-xs">
                    {index + 1}. {branch}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-accent/50 p-4 rounded-lg border border-border">
        <h4 className="font-semibold text-primary mb-2">Selection Guidelines:</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Select colleges and branches based on your cutoff mark and rank</li>
          <li>• Your preferences will be considered during seat allocation</li>
          <li>• You can select multiple options to increase your chances</li>
          <li>• Preferences can be modified during the counseling process</li>
        </ul>
      </div>
    </div>
  );
};