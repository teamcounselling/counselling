import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, FileText, Upload } from "lucide-react";

interface DeclarationData {
  willingness: boolean;
  signedDeclaration: File | null;
  feeFixationLetter: File | null;
  placementReport: File | null;
}

interface DeclarationSectionProps {
  data: DeclarationData;
  onChange: (data: DeclarationData) => void;
}

const DeclarationSection = ({ data, onChange }: DeclarationSectionProps) => {
  const updateField = (field: keyof DeclarationData, value: unknown) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleFileChange = (field: keyof DeclarationData, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateField(field, file);
  };

  const requiredDocuments = [
    {
      key: 'signedDeclaration' as keyof DeclarationData,
      label: 'Signed Declaration Form',
      description: 'Download, fill, sign and upload the official TNEA declaration form',
      required: true,
    },
    {
      key: 'feeFixationLetter' as keyof DeclarationData,
      label: 'Fee Fixation Letter',
      description: 'Government fee fixation letter or approval document',
      required: true,
    },
    {
      key: 'placementReport' as keyof DeclarationData,
      label: 'Previous Year Placement Report',
      description: 'Optional: Annual placement report with statistics and company details',
      required: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Willingness Declaration */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <FileText className="h-5 w-5" />
            Willingness Declaration
          </CardTitle>
          <CardDescription>
            Legal declaration of willingness to participate in TNEA counseling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> By checking this box, you declare that all information provided is true and accurate. 
              Any false information may lead to cancellation of admission.
            </AlertDescription>
          </Alert>

          <div className="p-4 border border-tnea-border rounded-lg bg-tnea-light-blue">
            <h4 className="font-medium text-tnea-blue mb-3">Declaration Statement</h4>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              "I hereby declare that our institution is willing to participate in the Tamil Nadu Engineering Admissions (TNEA) 
              counseling process for the academic year 2024-25. All information provided in this form is true and complete to the 
              best of my knowledge. I understand that any misrepresentation may result in disqualification from the counseling process. 
              Our institution agrees to abide by all rules, regulations, and guidelines set forth by the Anna University and the 
              Government of Tamil Nadu regarding the admission process."
            </p>
            
            <div className="flex items-start space-x-3">
              <Checkbox
                id="willingness"
                checked={data.willingness}
                onCheckedChange={(checked) => updateField('willingness', checked)}
                className="mt-1"
              />
              <Label htmlFor="willingness" className="text-sm font-medium cursor-pointer">
                I have read and understood the above declaration. I agree to all terms and conditions 
                of TNEA counseling process. *
              </Label>
            </div>
          </div>

          {data.willingness && (
            <Alert>
              <CheckCircle className="h-4 w-4 text-tnea-green" />
              <AlertDescription className="text-tnea-green">
                Declaration accepted. You can now proceed to upload the required documents.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Document Uploads */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <Upload className="h-5 w-5" />
            Required Documents
          </CardTitle>
          <CardDescription>
            Upload all necessary documents to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!data.willingness && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please accept the willingness declaration above to enable document uploads.
              </AlertDescription>
            </Alert>
          )}

          {requiredDocuments.map((doc) => (
            <div key={doc.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor={doc.key} className="text-base font-medium">
                    {doc.label} {doc.required && '*'}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {doc.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id={doc.key}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(doc.key, e)}
                    className="cursor-pointer"
                    disabled={!data.willingness}
                  />
                </div>
                <Upload className={`h-5 w-5 ${data.willingness ? 'text-muted-foreground' : 'text-gray-300'}`} />
              </div>

              {data[doc.key] && (
                <div className="flex items-center gap-2 p-2 bg-tnea-light-blue rounded">
                  <CheckCircle className="h-4 w-4 text-tnea-green" />
                  <span className="text-sm text-tnea-green">
                    File uploaded: {(data[doc.key] as File).name}
                  </span>
                </div>
              )}

              {doc.required && data.willingness && !data[doc.key] && (
                <p className="text-xs text-destructive">
                  This document is required for submission
                </p>
              )}
            </div>
          ))}

          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-2">File Upload Guidelines:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Accepted formats: PDF, JPG, JPEG, PNG</li>
              <li>• Maximum file size: 5MB per document</li>
              <li>• Ensure documents are clear and legible</li>
              <li>• All documents should be properly signed and sealed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeclarationSection;