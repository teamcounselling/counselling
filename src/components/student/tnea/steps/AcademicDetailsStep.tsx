import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AcademicDetailsData {
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
}

interface AcademicDetailsStepProps {
  data: AcademicDetailsData;
  onUpdate: (data: Partial<AcademicDetailsData>) => void;
}

const boards = [
  'Tamil Nadu State Board',
  'CBSE',
  'ICSE',
  'Matriculation',
  'Anglo Indian',
  'Other'
];

const years = Array.from({ length: 10 }, (_, i) => (2024 - i).toString());

export const AcademicDetailsStep: React.FC<AcademicDetailsStepProps> = ({ data, onUpdate }) => {
  const handleTenthUpdate = (field: string, value: string) => {
    onUpdate({
      tenth: { ...data.tenth, [field]: value }
    });
  };

  const handleTwelfthUpdate = (field: string, value: string) => {
    onUpdate({
      twelfth: { ...data.twelfth, [field]: value }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onUpdate({ marksheetFiles: [...data.marksheetFiles, ...files] });
  };

  const removeFile = (index: number) => {
    const updatedFiles = data.marksheetFiles.filter((_, i) => i !== index);
    onUpdate({ marksheetFiles: updatedFiles });
  };

  return (
    <div className="space-y-6">
      {/* 10th Standard Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-primary">10th Standard Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenth-marksheet">
                Marksheet Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tenth-marksheet"
                value={data.tenth.marksheetNumber}
                onChange={(e) => handleTenthUpdate('marksheetNumber', e.target.value)}
                placeholder="Enter 10th marksheet number"
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenth-school">
                School Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tenth-school"
                value={data.tenth.school}
                onChange={(e) => handleTenthUpdate('school', e.target.value)}
                placeholder="Enter school name"
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Board <span className="text-destructive">*</span>
              </Label>
              <Select value={data.tenth.board} onValueChange={(value) => handleTenthUpdate('board', value)}>
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board} value={board}>
                      {board}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Year of Passing <span className="text-destructive">*</span>
              </Label>
              <Select value={data.tenth.year} onValueChange={(value) => handleTenthUpdate('year', value)}>
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 12th Standard Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-primary">12th Standard Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twelfth-marksheet">
                Marksheet Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="twelfth-marksheet"
                value={data.twelfth.marksheetNumber}
                onChange={(e) => handleTwelfthUpdate('marksheetNumber', e.target.value)}
                placeholder="Enter 12th marksheet number"
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twelfth-school">
                School Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="twelfth-school"
                value={data.twelfth.school}
                onChange={(e) => handleTwelfthUpdate('school', e.target.value)}
                placeholder="Enter school name"
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Board <span className="text-destructive">*</span>
              </Label>
              <Select value={data.twelfth.board} onValueChange={(value) => handleTwelfthUpdate('board', value)}>
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((board) => (
                    <SelectItem key={board} value={board}>
                      {board}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Year of Passing <span className="text-destructive">*</span>
              </Label>
              <Select value={data.twelfth.year} onValueChange={(value) => handleTwelfthUpdate('year', value)}>
                <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-primary">Upload Marksheets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label>
              10th & 12th Marksheets <span className="text-destructive">*</span>
            </Label>
            
            {data.marksheetFiles.length > 0 && (
              <div className="space-y-2">
                {data.marksheetFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="flex-1 text-sm">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload 10th and 12th Marksheets
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                PDF, JPG, PNG (Max 5MB each)
              </p>
              <Button variant="outline" asChild>
                <label htmlFor="marksheetFiles" className="cursor-pointer">
                  Choose Files
                  <input
                    id="marksheetFiles"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-accent/50 p-4 rounded-lg border border-border">
        <h4 className="font-semibold text-primary mb-2">Document Guidelines:</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Upload clear, legible copies of both 10th and 12th marksheets</li>
          <li>• Ensure all details are clearly visible in the uploaded documents</li>
          <li>• Original certificates will be verified during admission</li>
          <li>• Any discrepancy in information may lead to rejection</li>
        </ul>
      </div>
    </div>
  );
};