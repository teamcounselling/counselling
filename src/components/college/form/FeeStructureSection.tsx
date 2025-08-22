import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, DollarSign, X } from "lucide-react";

interface FeeStructureData {
  govtQuotaFee: number;
  mgmtQuotaFee: number;
  scholarships: string[];
}

interface FeeStructureSectionProps {
  data: FeeStructureData;
  onChange: (data: FeeStructureData) => void;
}

const availableScholarships = [
  "Merit Scholarship",
  "Need-based Scholarship", 
  "Sports Scholarship",
  "Minority Scholarship",
  "SC/ST Scholarship",
  "OBC Scholarship",
  "First Graduate Scholarship",
  "Girl Child Scholarship",
  "Physically Challenged Scholarship",
  "Defence Personnel Scholarship"
];

const FeeStructureSection = ({ data, onChange }: FeeStructureSectionProps) => {
  const updateField = (field: keyof FeeStructureData, value: unknown) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const toggleScholarship = (scholarship: string) => {
    const currentScholarships = data.scholarships || [];
    const isSelected = currentScholarships.includes(scholarship);
    
    if (isSelected) {
      updateField('scholarships', currentScholarships.filter(s => s !== scholarship));
    } else {
      updateField('scholarships', [...currentScholarships, scholarship]);
    }
  };

  const removeScholarship = (scholarship: string) => {
    updateField('scholarships', data.scholarships.filter(s => s !== scholarship));
  };

  return (
    <div className="space-y-6">
      {/* Fee Structure */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <DollarSign className="h-5 w-5" />
            Annual Fee Structure
          </CardTitle>
          <CardDescription>
            Enter the annual tuition fees for different quota categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="govtQuotaFee">Government Quota Fee (Annual) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                <Input
                  id="govtQuotaFee"
                  type="number"
                  placeholder="Enter amount"
                  value={data.govtQuotaFee || ''}
                  onChange={(e) => updateField('govtQuotaFee', parseInt(e.target.value) || 0)}
                  className="pl-8"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Fee for students admitted through government quota (65% seats)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mgmtQuotaFee">Management Quota Fee (Annual) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                <Input
                  id="mgmtQuotaFee"
                  type="number"
                  placeholder="Enter amount"
                  value={data.mgmtQuotaFee || ''}
                  onChange={(e) => updateField('mgmtQuotaFee', parseInt(e.target.value) || 0)}
                  className="pl-8"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Fee for students admitted through management quota (35% seats)
              </p>
            </div>
          </div>

          {(data.govtQuotaFee > 0 || data.mgmtQuotaFee > 0) && (
            <div className="p-4 bg-tnea-light-blue rounded-lg">
              <h4 className="font-medium text-tnea-blue mb-2">Fee Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Govt Quota (Annual): </span>
                  <span className="font-medium">₹{data.govtQuotaFee?.toLocaleString() || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mgmt Quota (Annual): </span>
                  <span className="font-medium">₹{data.mgmtQuotaFee?.toLocaleString() || 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Govt Quota (4 Years): </span>
                  <span className="font-medium">₹{((data.govtQuotaFee || 0) * 4).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mgmt Quota (4 Years): </span>
                  <span className="font-medium">₹{((data.mgmtQuotaFee || 0) * 4).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scholarships */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <Award className="h-5 w-5" />
            Available Scholarships
          </CardTitle>
          <CardDescription>
            Select all scholarships and financial aid programs available at your college
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Scholarships */}
          {data.scholarships.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Scholarships:</Label>
              <div className="flex flex-wrap gap-2">
                {data.scholarships.map((scholarship) => (
                  <Badge
                    key={scholarship}
                    variant="secondary"
                    className="bg-tnea-green text-white flex items-center gap-1"
                  >
                    {scholarship}
                    <button
                      onClick={() => removeScholarship(scholarship)}
                      className="ml-1 hover:text-red-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Available Scholarships */}
          <div className="space-y-2">
            <Label>Available Scholarship Programs:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableScholarships.map((scholarship) => (
                <div key={scholarship} className="flex items-center space-x-2">
                  <Checkbox
                    id={scholarship}
                    checked={data.scholarships.includes(scholarship)}
                    onCheckedChange={() => toggleScholarship(scholarship)}
                  />
                  <Label htmlFor={scholarship} className="text-sm font-normal cursor-pointer">
                    {scholarship}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {data.scholarships.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No scholarships selected</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeeStructureSection;