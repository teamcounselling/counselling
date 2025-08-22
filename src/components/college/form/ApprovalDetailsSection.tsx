import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, FileCheck, Upload } from "lucide-react";

interface ApprovalDetailsData {
  aicteStatus: string;
  aicteLetter: File | null;
  affiliationStatus: string;
  affiliationCertificate: File | null;
  isoCertification: File | null;
}

interface ApprovalDetailsSectionProps {
  data: ApprovalDetailsData;
  onChange: (data: ApprovalDetailsData) => void;
}

const ApprovalDetailsSection = ({ data, onChange }: ApprovalDetailsSectionProps) => {
  const updateField = (field: keyof ApprovalDetailsData, value: string | File | null) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleFileChange = (field: keyof ApprovalDetailsData, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateField(field, file);
  };

  return (
    <div className="space-y-6">
      {/* AICTE Approval */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <Award className="h-5 w-5" />
            AICTE Approval Details
          </CardTitle>
          <CardDescription>
            All India Council for Technical Education approval information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aicteStatus">AICTE Approval Status *</Label>
            <Select value={data.aicteStatus} onValueChange={(value) => updateField('aicteStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select AICTE status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="applied">Application Submitted</SelectItem>
                <SelectItem value="renewal">Renewal in Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aicteLetter">Upload AICTE Approval Letter *</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="aicteLetter"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('aicteLetter', e)}
                  className="cursor-pointer"
                />
              </div>
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            {data.aicteLetter && (
              <p className="text-sm text-tnea-green">
                ✓ File uploaded: {data.aicteLetter.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, JPG, PNG (Max size: 5MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* University Affiliation */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <FileCheck className="h-5 w-5" />
            University Affiliation
          </CardTitle>
          <CardDescription>
            University affiliation and recognition details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="affiliationStatus">Affiliation Status *</Label>
            <Select value={data.affiliationStatus} onValueChange={(value) => updateField('affiliationStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select affiliation status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anna-university">Anna University</SelectItem>
                <SelectItem value="deemed-university">Deemed University</SelectItem>
                <SelectItem value="autonomous">Autonomous</SelectItem>
                <SelectItem value="other">Other University</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliationCertificate">Upload Affiliation Certificate *</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="affiliationCertificate"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('affiliationCertificate', e)}
                  className="cursor-pointer"
                />
              </div>
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            {data.affiliationCertificate && (
              <p className="text-sm text-tnea-green">
                ✓ File uploaded: {data.affiliationCertificate.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ISO Certification (Optional) */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <Award className="h-5 w-5" />
            Quality Certification
          </CardTitle>
          <CardDescription>
            ISO or other quality certifications (Optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="isoCertification">Upload ISO Certification (Optional)</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="isoCertification"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('isoCertification', e)}
                  className="cursor-pointer"
                />
              </div>
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            {data.isoCertification && (
              <p className="text-sm text-tnea-green">
                ✓ File uploaded: {data.isoCertification.name}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              ISO 9001, ISO 14001, NAAC accreditation, or other quality certifications
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalDetailsSection;