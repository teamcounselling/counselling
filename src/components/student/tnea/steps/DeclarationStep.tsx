import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, FileSignature } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DeclarationData {
  agreed: boolean;
  signatureFile: File | null;
}

interface DeclarationStepProps {
  data: DeclarationData;
  onUpdate: (data: Partial<DeclarationData>) => void;
}

export const DeclarationStep: React.FC<DeclarationStepProps> = ({ data, onUpdate }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onUpdate({ signatureFile: file });
  };

  const removeFile = () => {
    onUpdate({ signatureFile: null });
  };

  return (
    <div className="space-y-6">
      {/* Declaration Text */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Declaration and Consent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/30 p-6 rounded-lg border">
            <h3 className="font-semibold text-foreground mb-4">
              DECLARATION BY THE CANDIDATE
            </h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                I hereby declare that:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                  All the information provided by me in this application form is true, complete and correct to the best of my knowledge and belief.
                </li>
                <li>
                  I understand that any false information or suppression of material facts will disqualify my candidature for admission.
                </li>
                <li>
                  I have read and understood all the rules, regulations, and guidelines for TNEA admissions as published by Anna University.
                </li>
                <li>
                  I agree to abide by all the terms and conditions set forth by the admission authorities.
                </li>
                <li>
                  I understand that admission is subject to verification of original documents and meeting the eligibility criteria.
                </li>
                <li>
                  I consent to the processing of my personal data for admission purposes and understand that my information may be shared with relevant educational institutions.
                </li>
                <li>
                  I acknowledge that the admission authorities have the right to cancel my admission at any stage if any information is found to be false or if I fail to meet the required criteria.
                </li>
                <li>
                  I will submit all required original documents during the counseling process and admission procedure.
                </li>
              </ol>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <Checkbox
                id="declaration"
                checked={data.agreed}
                onCheckedChange={(checked) => onUpdate({ agreed: checked as boolean })}
                className="mt-0.5"
              />
              <Label htmlFor="declaration" className="text-sm leading-relaxed cursor-pointer">
                <span className="text-destructive">*</span> I have read and understood the above declaration. 
                I agree to all the terms and conditions mentioned above and declare that all the information 
                provided is true and accurate.
              </Label>
            </div>
          </div>

          {!data.agreed && (
            <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg">
              <p className="text-sm text-warning-foreground">
                You must accept the declaration to proceed with the application.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature Upload */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-primary">Digital Signature (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label>
              Upload Your Signature
            </Label>
            <p className="text-sm text-muted-foreground">
              Upload a scanned copy of your signature. This is optional but recommended for verification purposes.
            </p>
            
            {data.signatureFile ? (
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border">
                <FileText className="h-5 w-5 text-primary" />
                <span className="flex-1 text-sm">{data.signatureFile.name}</span>
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
                  Upload Signature
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  JPG, PNG (Max 2MB)
                </p>
                <Button variant="outline" asChild>
                  <label htmlFor="signature" className="cursor-pointer">
                    Choose File
                    <input
                      id="signature"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </Button>
              </div>
            )}
          </div>

          <div className="bg-accent/50 p-4 rounded-lg border border-border">
            <h4 className="font-semibold text-primary mb-2">Signature Guidelines:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Use black or blue ink on white paper</li>
              <li>• Signature should be clear and legible</li>
              <li>• Scan at minimum 300 DPI resolution</li>
              <li>• File size should not exceed 2MB</li>
              <li>• This signature will be used for verification during admission</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
        <h4 className="font-semibold text-destructive mb-2">Important Notice:</h4>
        <p className="text-sm text-muted-foreground">
          By proceeding with this application, you acknowledge that providing false or misleading information 
          is a serious offense and may result in immediate disqualification from the admission process. 
          All information will be verified against official documents during the counseling process.
        </p>
      </div>
    </div>
  );
};