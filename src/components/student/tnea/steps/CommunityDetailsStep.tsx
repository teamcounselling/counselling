import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';

interface CommunityDetailsData {
  community: string;
  casteName: string;
  communityFile: File | null;
  specialCategories: string[];
}

interface CommunityDetailsStepProps {
  data: CommunityDetailsData;
  onUpdate: (data: Partial<CommunityDetailsData>) => void;
}

const communities = [
  { value: 'OC', label: 'Open Category (OC)' },
  { value: 'BC', label: 'Backward Class (BC)' },
  { value: 'MBC', label: 'Most Backward Class (MBC)' },
  { value: 'SC', label: 'Scheduled Caste (SC)' },
  { value: 'ST', label: 'Scheduled Tribe (ST)' }
];

const specialCategories = [
  'Ex-Servicemen',
  'Sports Quota',
  'Differently Abled',
  'First Graduate',
  'Children of Ex-Servicemen',
  'NCC',
  'NSS'
];

export const CommunityDetailsStep: React.FC<CommunityDetailsStepProps> = ({ data, onUpdate }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onUpdate({ communityFile: file });
  };

  const handleSpecialCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...data.specialCategories, category]
      : data.specialCategories.filter(c => c !== category);
    onUpdate({ specialCategories: updatedCategories });
  };

  const removeFile = () => {
    onUpdate({ communityFile: null });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>
            Community <span className="text-destructive">*</span>
          </Label>
          <Select value={data.community} onValueChange={(value) => onUpdate({ community: value })}>
            <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select your community" />
            </SelectTrigger>
            <SelectContent>
              {communities.map((community) => (
                <SelectItem key={community.value} value={community.value}>
                  {community.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="casteName">
            Caste Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="casteName"
            value={data.casteName}
            onChange={(e) => onUpdate({ casteName: e.target.value })}
            placeholder="Enter your caste name"
            className="focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>
          Community Certificate Upload <span className="text-destructive">*</span>
        </Label>
        
        {data.communityFile ? (
          <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border">
            <FileText className="h-5 w-5 text-primary" />
            <span className="flex-1 text-sm">{data.communityFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload Community Certificate
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              PDF, JPG, PNG (Max 5MB)
            </p>
            <Button variant="outline" asChild>
              <label htmlFor="communityFile" className="cursor-pointer">
                Choose File
                <input
                  id="communityFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label>Special Categories (if applicable)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {specialCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={data.specialCategories.includes(category)}
                onCheckedChange={(checked) => 
                  handleSpecialCategoryChange(category, checked as boolean)
                }
              />
              <Label htmlFor={category} className="text-sm">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
        <h4 className="font-semibold text-warning-foreground mb-2">Document Requirements:</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Community certificate issued by competent authority</li>
          <li>• Certificate should be valid and not expired</li>
          <li>• For special categories, additional documents may be required during verification</li>
        </ul>
      </div>
    </div>
  );
};