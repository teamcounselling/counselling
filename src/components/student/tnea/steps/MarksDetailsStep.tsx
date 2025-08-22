import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarksDetailsData {
  maths: string;
  physics: string;
  chemistry: string;
  cutoff: string;
  combinedMarksheetFile: File | null;
}

interface MarksDetailsStepProps {
  data: MarksDetailsData;
  onUpdate: (data: Partial<MarksDetailsData>) => void;
}

export const MarksDetailsStep: React.FC<MarksDetailsStepProps> = ({ data, onUpdate }) => {
  const calculateCutoff = () => {
    const mathsMarks = parseFloat(data.maths) || 0;
    const physicsMarks = parseFloat(data.physics) || 0;
    const chemistryMarks = parseFloat(data.chemistry) || 0;
    
    // TNEA cutoff calculation: (Maths + Physics + Chemistry) / 3
    const cutoff = (mathsMarks + physicsMarks + chemistryMarks) / 3;
    onUpdate({ cutoff: cutoff.toFixed(2) });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onUpdate({ combinedMarksheetFile: file });
  };

  const removeFile = () => {
    onUpdate({ combinedMarksheetFile: null });
  };

  useEffect(() => {
    if (data.maths && data.physics && data.chemistry) {
      calculateCutoff();
    }
  }, [data.maths, data.physics, data.chemistry]);

  return (
    <div className="space-y-6">
      {/* Subject Marks */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Subject Marks (12th Standard)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maths">
                Mathematics <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maths"
                type="number"
                min="0"
                max="100"
                value={data.maths}
                onChange={(e) => onUpdate({ maths: e.target.value })}
                placeholder="Enter marks out of 100"
                className="focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">Out of 100</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="physics">
                Physics <span className="text-destructive">*</span>
              </Label>
              <Input
                id="physics"
                type="number"
                min="0"
                max="100"
                value={data.physics}
                onChange={(e) => onUpdate({ physics: e.target.value })}
                placeholder="Enter marks out of 100"
                className="focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">Out of 100</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chemistry">
                Chemistry <span className="text-destructive">*</span>
              </Label>
              <Input
                id="chemistry"
                type="number"
                min="0"
                max="100"
                value={data.chemistry}
                onChange={(e) => onUpdate({ chemistry: e.target.value })}
                placeholder="Enter marks out of 100"
                className="focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">Out of 100</p>
            </div>
          </div>

          {/* Cutoff Calculation */}
          <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-primary font-semibold">TNEA Cutoff Mark</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Calculated as (Maths + Physics + Chemistry) ÷ 3
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {data.cutoff || '0.00'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={calculateCutoff}
                  className="mt-2"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Recalculate
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cutoff">
              Manual Cutoff Override (Optional)
            </Label>
            <Input
              id="cutoff"
              type="number"
              step="0.01"
              value={data.cutoff}
              onChange={(e) => onUpdate({ cutoff: e.target.value })}
              placeholder="Enter cutoff manually if different"
              className="focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use auto-calculated cutoff
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-primary">Combined Marksheet Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label>
              Combined Marksheet (12th Standard) <span className="text-destructive">*</span>
            </Label>
            
            {data.combinedMarksheetFile ? (
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border">
                <FileText className="h-5 w-5 text-primary" />
                <span className="flex-1 text-sm">{data.combinedMarksheetFile.name}</span>
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
                  Upload Combined Marksheet
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  PDF, JPG, PNG (Max 5MB)
                </p>
                <Button variant="outline" asChild>
                  <label htmlFor="combinedMarksheet" className="cursor-pointer">
                    Choose File
                    <input
                      id="combinedMarksheet"
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
        </CardContent>
      </Card>

      <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
        <h4 className="font-semibold text-success-foreground mb-2">Important Notes:</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Enter marks exactly as mentioned in your 12th standard marksheet</li>
          <li>• Cutoff will be auto-calculated based on TNEA formula</li>
          <li>• Upload the official combined marksheet showing all subject marks</li>
          <li>• Any discrepancy during verification may affect admission</li>
        </ul>
      </div>
    </div>
  );
};