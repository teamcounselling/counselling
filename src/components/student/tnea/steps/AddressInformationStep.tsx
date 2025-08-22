import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddressInformationData {
  permanentAddress: string;
  state: string;
  district: string;
  pincode: string;
}

interface AddressInformationStepProps {
  data: AddressInformationData;
  onUpdate: (data: Partial<AddressInformationData>) => void;
}

const tnStates = [
  'Tamil Nadu',
  'Andhra Pradesh',
  'Karnataka',
  'Kerala',
  'Puducherry',
  'Other'
];

const tnDistricts = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
  'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Ranipet',
  'Kanchipuram', 'Karur', 'Ramanathapuram', 'Virudhunagar', 'Cuddalore',
  'Nagapattinam', 'Villupuram', 'Sivaganga', 'Tiruvarur', 'Perambalur',
  'The Nilgiris', 'Dharmapuri', 'Krishnagiri', 'Tiruppur', 'Ariyalur',
  'Namakkal', 'Kallakurichi', 'Tirupattur', 'Tenkasi', 'Chengalpattu',
  'Tiruvallur', 'Mayiladuthurai', 'Kanyakumari'
];

export const AddressInformationStep: React.FC<AddressInformationStepProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="permanentAddress">
            Permanent Address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="permanentAddress"
            value={data.permanentAddress}
            onChange={(e) => onUpdate({ permanentAddress: e.target.value })}
            placeholder="Enter your complete permanent address"
            rows={4}
            className="focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>
              State <span className="text-destructive">*</span>
            </Label>
            <Select value={data.state} onValueChange={(value) => onUpdate({ state: value })}>
              <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {tnStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              District <span className="text-destructive">*</span>
            </Label>
            <Select value={data.district} onValueChange={(value) => onUpdate({ district: value })}>
              <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {tnDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">
              Pincode <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pincode"
              value={data.pincode}
              onChange={(e) => onUpdate({ pincode: e.target.value })}
              placeholder="6-digit pincode"
              maxLength={6}
              className="focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-accent/50 p-4 rounded-lg border border-border">
        <h4 className="font-semibold text-primary mb-2">Important Notes:</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Ensure your address matches your Aadhaar card details</li>
          <li>• This address will be used for all official communications</li>
          <li>• Any changes after submission may require document verification</li>
        </ul>
      </div>
    </div>
  );
};