import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Building, Bus, Microscope, Users, Wifi } from "lucide-react";

interface InfrastructureData {
  hostel: boolean;
  transport: boolean;
  internet: boolean;
  libraryVolumes: number;
  labInfo: string;
  placementCell: boolean;
  placementDetails: string;
}

interface InfrastructureSectionProps {
  data: InfrastructureData;
  onChange: (data: InfrastructureData) => void;
}

const InfrastructureSection = ({ data, onChange }: InfrastructureSectionProps) => {
  const updateField = (field: keyof InfrastructureData, value: unknown) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const facilities = [
    { 
      key: 'hostel' as keyof InfrastructureData,
      label: 'Hostel Facility',
      icon: Building,
      description: 'On-campus accommodation for students'
    },
    { 
      key: 'transport' as keyof InfrastructureData,
      label: 'Transportation',
      icon: Bus,
      description: 'College bus service available'
    },
    { 
      key: 'internet' as keyof InfrastructureData,
      label: 'Internet/WiFi',
      icon: Wifi,
      description: 'Campus-wide internet connectivity'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Basic Facilities */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <Building className="h-5 w-5" />
            Basic Facilities
          </CardTitle>
          <CardDescription>
            Essential infrastructure and facilities available at your college
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {facilities.map((facility) => {
              const Icon = facility.icon;
              const isEnabled = data[facility.key] as boolean;
              
              return (
                <div key={facility.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-tnea-blue" />
                      <Label htmlFor={facility.key} className="font-medium">
                        {facility.label}
                      </Label>
                    </div>
                    <Switch
                      id={facility.key}
                      checked={isEnabled}
                      onCheckedChange={(checked) => updateField(facility.key, checked)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {facility.description}
                  </p>
                  {isEnabled && (
                    <Badge variant="secondary" className="bg-tnea-green text-white">
                      Available
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Library Details */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <BookOpen className="h-5 w-5" />
            Library Information
          </CardTitle>
          <CardDescription>
            Details about your college library and resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="libraryVolumes">Total Library Volumes *</Label>
            <Input
              id="libraryVolumes"
              type="number"
              placeholder="Number of books and journals"
              value={data.libraryVolumes || ''}
              onChange={(e) => updateField('libraryVolumes', parseInt(e.target.value) || 0)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Include books, journals, digital resources, and reference materials
            </p>
          </div>

          {data.libraryVolumes > 0 && (
            <div className="p-3 bg-tnea-light-blue rounded-lg">
              <p className="text-sm text-tnea-blue">
                <BookOpen className="h-4 w-4 inline mr-2" />
                Library Collection: {data.libraryVolumes.toLocaleString()} volumes
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Laboratory Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <Microscope className="h-5 w-5" />
            Laboratory Facilities
          </CardTitle>
          <CardDescription>
            Information about laboratories and technical facilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="labInfo">Laboratory Details *</Label>
            <Textarea
              id="labInfo"
              placeholder="Describe available laboratories, equipment, and technical facilities..."
              value={data.labInfo}
              onChange={(e) => updateField('labInfo', e.target.value)}
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Include details about department-wise labs, equipment, software, and specialized facilities
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Placement Cell */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <Users className="h-5 w-5" />
            Placement & Career Services
          </CardTitle>
          <CardDescription>
            Information about placement cell and career support services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-tnea-blue" />
              <Label htmlFor="placementCell" className="font-medium">
                Dedicated Placement Cell
              </Label>
            </div>
            <Switch
              id="placementCell"
              checked={data.placementCell}
              onCheckedChange={(checked) => updateField('placementCell', checked)}
            />
          </div>

          {data.placementCell && (
            <div className="space-y-2">
              <Label htmlFor="placementDetails">Placement Cell Details *</Label>
              <Textarea
                id="placementDetails"
                placeholder="Describe placement activities, industry partnerships, training programs, and career support services..."
                value={data.placementDetails}
                onChange={(e) => updateField('placementDetails', e.target.value)}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                Include information about placement statistics, recruiting companies, and student support programs
              </p>
            </div>
          )}

          {data.placementCell && (
            <div className="p-3 bg-tnea-light-blue rounded-lg">
              <p className="text-sm text-tnea-blue">
                <Users className="h-4 w-4 inline mr-2" />
                Placement Cell is operational with dedicated support services
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InfrastructureSection;