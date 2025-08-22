import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase-cred";
import { Building, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";

interface CollegeDetailsData {
  collegeName: string;
  collegeCode: string;
  address: string;
  district: string;
  collegeType: string;
  minorityStatus: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
  };
}

interface CollegeDetailsSectionProps {
  data: CollegeDetailsData;
  onChange: (data: CollegeDetailsData) => void;
}

// const tnDistricts = [
//   "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
//   "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
//   "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal",
//   "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet",
//   "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi",
//   "Tiruchirappalli", "Tirunelveli", "Tirupattur", "Tiruppur", "Tiruvallur",
//   "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
// ];

const CollegeDetailsSection = ({ data, onChange }: CollegeDetailsSectionProps) => {

  const  [tnDistricts, setTnDistricts] = useState([])

  const updateField = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      onChange({
        ...data,
        [parent]: {
          ...(data as unknown)[parent],
          [child]: value,
        },
      });
    } else {
      onChange({
        ...data,
        [field]: value,
      });
    }
  };

  useEffect(() => {
    const fetchDistricts = async () => {
      const { data, error } = await supabase
        .from('tamilnadu_districts')
        .select('name')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching districts:', error);
      } else {
        setTnDistricts(data);
      }
    };

    fetchDistricts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Basic College Information */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <Building className="h-5 w-5" />
            Basic College Information
          </CardTitle>
          <CardDescription>
            Enter the basic details of your engineering college
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collegeName">College Name *</Label>
              <Input
                id="collegeName"
                placeholder="Enter full college name"
                value={data.collegeName}
                onChange={(e) => updateField('collegeName', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="collegeCode">College Code *</Label>
              <Input
                id="collegeCode"
                placeholder="e.g., 1001"
                value={data.collegeCode}
                onChange={(e) => updateField('collegeCode', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">College Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter complete postal address"
              value={data.address}
              onChange={(e) => updateField('address', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Select value={data.district} onValueChange={(value) => updateField('district', value)}>
                <SelectTrigger>
                  <MapPin className="h-4 w-4" />
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {tnDistricts.map((district) => (
                    <SelectItem key={district.name} value={district.name}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minorityStatus">Minority Status *</Label>
              <Select value={data.minorityStatus} onValueChange={(value) => updateField('minorityStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select minority status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minority">Minority</SelectItem>
                  <SelectItem value="non-minority">Non-Minority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>College Type *</Label>
            <RadioGroup
              value={data.collegeType}
              onValueChange={(value) => updateField('collegeType', value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="government" id="government" />
                <Label htmlFor="government">Government</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="government-aided" id="government-aided" />
                <Label htmlFor="government-aided">Government Aided</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="self-financing" id="self-financing" />
                <Label htmlFor="self-financing">Self-Financing</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Contact Person Details */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <User className="h-5 w-5" />
            Contact Person Details
          </CardTitle>
          <CardDescription>
            Primary contact person for TNEA counseling process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Person Name *</Label>
            <Input
              id="contactName"
              placeholder="Enter full name"
              value={data.contactPerson.name}
              onChange={(e) => updateField('contactPerson.name', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@college.edu"
                  value={data.contactPerson.email}
                  onChange={(e) => updateField('contactPerson.email', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={data.contactPerson.phone}
                  onChange={(e) => updateField('contactPerson.phone', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeDetailsSection;

