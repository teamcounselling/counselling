import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, User, MapPin, Users, GraduationCap, Target, Heart, FileSignature, Send, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { FormData } from '../TNEARegistrationForm';

interface PreviewStepProps {
  formData: FormData;
  onEdit: (step: number) => void;
  onSubmit: () => void;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({ formData, onEdit, onSubmit }) => {
  const renderPersonalDetails = () => (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Details
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Full Name:</span>
            <p className="text-sm">{formData.personal_details.fullName || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Date of Birth:</span>
            <p className="text-sm">
              {formData.personal_details.dateOfBirth 
                ? format(formData.personal_details.dateOfBirth, 'PPP')
                : 'Not provided'
              }
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Gender:</span>
            <p className="text-sm capitalize">{formData.personal_details.gender || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Email:</span>
            <p className="text-sm">{formData.personal_details.email || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Mobile:</span>
            <p className="text-sm">{formData.personal_details.mobile || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Aadhaar:</span>
            <p className="text-sm">{formData.personal_details.aadhaar || 'Not provided'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAddressInfo = () => (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Permanent Address:</span>
          <p className="text-sm">{formData.address_info.permanentAddress || 'Not provided'}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">State:</span>
            <p className="text-sm">{formData.address_info.state || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">District:</span>
            <p className="text-sm">{formData.address_info.district || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Pincode:</span>
            <p className="text-sm">{formData.address_info.pincode || 'Not provided'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCommunityInfo = () => (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community & Category
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Community:</span>
            <p className="text-sm">{formData.community_info.community || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Caste Name:</span>
            <p className="text-sm">{formData.community_info.casteName || 'Not provided'}</p>
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Community Certificate:</span>
          <p className="text-sm flex items-center gap-2">
            {formData.community_info.communityFile ? (
              <>
                <FileText className="h-4 w-4" />
                {formData.community_info.communityFile.name}
              </>
            ) : (
              'Not uploaded'
            )}
          </p>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Special Categories:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {formData.community_info.specialCategories.length > 0 ? (
              formData.community_info.specialCategories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))
            ) : (
              <p className="text-sm">None selected</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAcademicDetails = () => (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Academic Details
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(4)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2">10th Standard</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Marksheet Number:</span>
              <p className="text-sm">{formData.academic_details.tenth.marksheetNumber || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">School:</span>
              <p className="text-sm">{formData.academic_details.tenth.school || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Board:</span>
              <p className="text-sm">{formData.academic_details.tenth.board || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Year:</span>
              <p className="text-sm">{formData.academic_details.tenth.year || 'Not provided'}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-semibold mb-2">12th Standard</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Marksheet Number:</span>
              <p className="text-sm">{formData.academic_details.twelfth.marksheetNumber || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">School:</span>
              <p className="text-sm">{formData.academic_details.twelfth.school || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Board:</span>
              <p className="text-sm">{formData.academic_details.twelfth.board || 'Not provided'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Year:</span>
              <p className="text-sm">{formData.academic_details.twelfth.year || 'Not provided'}</p>
            </div>
          </div>
        </div>

        <div>
          <span className="text-sm font-medium text-muted-foreground">Uploaded Marksheets:</span>
          <p className="text-sm">
            {formData.academic_details.marksheetFiles.length} file(s) uploaded
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderMarks = () => (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Target className="h-5 w-5" />
            Marks & Cutoff
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(5)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Mathematics:</span>
            <p className="text-sm">{formData.marks.maths || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Physics:</span>
            <p className="text-sm">{formData.marks.physics || 'Not provided'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Chemistry:</span>
            <p className="text-sm">{formData.marks.chemistry || 'Not provided'}</p>
          </div>
        </div>
        <div className="bg-primary/10 p-3 rounded-lg">
          <span className="text-sm font-medium text-primary">TNEA Cutoff Mark:</span>
          <p className="text-lg font-bold text-primary">{formData.marks.cutoff || '0.00'}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Combined Marksheet:</span>
          <p className="text-sm flex items-center gap-2">
            {formData.marks.combinedMarksheetFile ? (
              <>
                <FileText className="h-4 w-4" />
                {formData.marks.combinedMarksheetFile.name}
              </>
            ) : (
              'Not uploaded'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderPreferences = () => (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <Heart className="h-5 w-5" />
            College & Branch Preferences
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(6)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Preferred Colleges:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {formData.preferences.colleges.length > 0 ? (
              formData.preferences.colleges.map((college, index) => (
                <Badge key={college} variant="secondary" className="text-xs">
                  {index + 1}. {college}
                </Badge>
              ))
            ) : (
              <p className="text-sm">None selected</p>
            )}
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Preferred Branches:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {formData.preferences.branches.length > 0 ? (
              formData.preferences.branches.map((branch, index) => (
                <Badge key={branch} variant="secondary" className="text-xs">
                  {index + 1}. {branch}
                </Badge>
              ))
            ) : (
              <p className="text-sm">None selected</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDeclaration = () => (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Declaration & Signature
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => onEdit(7)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Declaration Accepted:</span>
          <div className="flex items-center gap-2 mt-1">
            {formData.declaration.agreed ? (
              <Badge variant="default" className="bg-success text-success-foreground">
                Agreed
              </Badge>
            ) : (
              <Badge variant="destructive">
                Not Agreed
              </Badge>
            )}
          </div>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Signature:</span>
          <p className="text-sm flex items-center gap-2">
            {formData.declaration.signatureFile ? (
              <>
                <FileText className="h-4 w-4" />
                {formData.declaration.signatureFile.name}
              </>
            ) : (
              'Not uploaded'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 p-6 rounded-lg border border-primary/20 text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Application Preview</h2>
        <p className="text-muted-foreground">
          Please review all the information below before submitting your application. 
          You can edit any section by clicking the "Edit" button.
        </p>
      </div>

      {renderPersonalDetails()}
      {renderAddressInfo()}
      {renderCommunityInfo()}
      {renderAcademicDetails()}
      {renderMarks()}
      {renderPreferences()}
      {renderDeclaration()}

      <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-success mb-4">Ready to Submit?</h3>
          <p className="text-muted-foreground mb-6">
            By clicking submit, you confirm that all information provided is accurate and complete. 
            You will receive a confirmation email with your application details.
          </p>
          <Button
            onClick={onSubmit}
            size="lg"
            className="bg-success hover:bg-success/90 text-success-foreground px-8"
          >
            <Send className="h-5 w-5 mr-2" />
            Submit Application
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};