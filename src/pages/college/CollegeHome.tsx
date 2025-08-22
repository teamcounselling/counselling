import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Award, Building2, ChevronLeft, ChevronRight, DollarSign, Eye, FileText, GraduationCap, Save, Send, Wifi } from "lucide-react";
import { useState } from "react";

import ApprovalDetailsSection from "@/components/college/form/ApprovalDetailsSection";
import CollegeDetailsSection from "@/components/college/form/CollegeDetailsSection";
import CourseMatrixSection from "@/components/college/form/CourseMatrixSection";
import DeclarationSection from "@/components/college/form/DeclarationSection";
import FeeStructureSection from "@/components/college/form/FeeStructureSection";
import InfrastructureSection from "@/components/college/form/InfrastructureSection";

export interface FormData {
  collegeDetails: {
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
  };
  approvalDetails: {
    aicteStatus: string;
    aicteLetter: File | null;
    affiliationStatus: string;
    affiliationCertificate: File | null;
    isoCertification: File | null;
  };
  courseMatrix: Array<{
    id: string;
    department: string;
    duration: string;
    sanctionedIntake: number;
    govtQuotaSeats: number;
    mgmtQuotaSeats: number;
    nbaAccredited: boolean;
  }>;
  feeStructure: {
    govtQuotaFee: number;
    mgmtQuotaFee: number;
    scholarships: string[];
  };
  infrastructure: {
    hostel: boolean;
    transport: boolean;
    internet: boolean;
    libraryVolumes: number;
    labInfo: string;
    placementCell: boolean;
    placementDetails: string;
  };
  declaration: {
    willingness: boolean;
    signedDeclaration: File | null;
    feeFixationLetter: File | null;
    placementReport: File | null;
  };
}

const CollegeHome = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("college-details");
  const [formData, setFormData] = useState<FormData>({
    collegeDetails: {
      collegeName: "",
      collegeCode: "",
      address: "",
      district: "",
      collegeType: "",
      minorityStatus: "",
      contactPerson: {
        name: "",
        email: "",
        phone: "",
      },
    },
    approvalDetails: {
      aicteStatus: "",
      aicteLetter: null,
      affiliationStatus: "",
      affiliationCertificate: null,
      isoCertification: null,
    },
    courseMatrix: [],
    feeStructure: {
      govtQuotaFee: 0,
      mgmtQuotaFee: 0,
      scholarships: [],
    },
    infrastructure: {
      hostel: false,
      transport: false,
      internet: false,
      libraryVolumes: 0,
      labInfo: "",
      placementCell: false,
      placementDetails: "",
    },
    declaration: {
      willingness: false,
      signedDeclaration: null,
      feeFixationLetter: null,
      placementReport: null,
    },
  });

  const tabs = [
    { id: "college-details", label: "College Details", icon: Building2 },
    { id: "approval-details", label: "Approval Details", icon: Award },
    { id: "course-matrix", label: "Course & Seats", icon: GraduationCap },
    { id: "fee-structure", label: "Fee Structure", icon: DollarSign },
    { id: "infrastructure", label: "Infrastructure", icon: Wifi },
    { id: "declaration", label: "Declaration", icon: FileText },
    { id: "preview", label: "Preview", icon: Eye },
  ];

  const calculateProgress = () => {
    const sections = [
      formData.collegeDetails.collegeName && formData.collegeDetails.collegeCode,
      formData.approvalDetails.aicteStatus,
      formData.courseMatrix.length > 0,
      formData.feeStructure.govtQuotaFee > 0,
      formData.infrastructure.libraryVolumes > 0,
      formData.declaration.willingness,
    ];
    return (sections.filter(Boolean).length / sections.length) * 100;
  };

  const handleSaveDraft = () => {
    localStorage.setItem("tnea-form-draft", JSON.stringify(formData));
    toast({
      title: "Draft Saved",
      description: "Your form has been saved as draft successfully.",
    });
  };

  const handleSubmit = () => {
    if (calculateProgress() < 100) {
      toast({
        title: "Incomplete Form",
        description: "Please complete all sections before submitting.",
        variant: "destructive",
      });
      return;
    }
    console.log(
      formData, "data"
    );
    

    // Here you would typically submit to an API
    toast({
      title: "Form Submitted",
      description: "Your TNEA registration has been submitted successfully.",
    });
  };

  const updateFormData = (section: keyof FormData, data: unknown) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  
  const goToNextTab = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };
  
  const goToPreviousTab = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const NavigationButtons = () => {
    const currentIndex = getCurrentTabIndex();
    const isFirstTab = currentIndex === 0;
    const isPreviewTab = activeTab === "preview";
    const isLastFormTab = currentIndex === tabs.length - 2; // Before preview

    return (
      <div className="flex justify-between mt-6 pt-6 border-t">
        <Button
          variant="outline"
          onClick={goToPreviousTab}
          disabled={isFirstTab}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          
          {isPreviewTab ? (
            <Button
              variant="college"
              onClick={handleSubmit}
              size="lg"
            >
              <Send className="h-4 w-4" />
              Submit Registration
            </Button>
          ) : isLastFormTab ? (
            <Button
              variant="college"
              onClick={goToNextTab}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview & Submit
            </Button>
          ) : (
            <Button
              variant="college"
              onClick={goToNextTab}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-header p-8 rounded-lg shadow-form mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Engineering College Registration
            </h1>
            <p className="text-lg opacity-90">
              Tamil Nadu Engineering Admissions (TNEA) - Academic Year 2024-25
            </p>
          </div>
          
          <div className="bg-card p-4 rounded-lg shadow-card">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Form Completion</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(calculateProgress())}%
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </div>

        {/* Main Form */}
        <Card className="shadow-form">
          <CardHeader>
            <CardTitle className="text-tnea-blue">College Registration Form</CardTitle>
            <CardDescription>
              Please fill in all the required information accurately. All mandatory fields are marked with an asterisk (*).
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2 text-xs lg:text-sm"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden lg:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="college-details" className="space-y-6">
                <CollegeDetailsSection
                  data={formData.collegeDetails}
                  onChange={(data) => updateFormData("collegeDetails", data)}
                />
                <NavigationButtons />
              </TabsContent>

              <TabsContent value="approval-details" className="space-y-6">
                <ApprovalDetailsSection
                  data={formData.approvalDetails}
                  onChange={(data) => updateFormData("approvalDetails", data)}
                />
                <NavigationButtons />
              </TabsContent>

              <TabsContent value="course-matrix" className="space-y-6">
                <CourseMatrixSection
                  data={formData.courseMatrix}
                  onChange={(data) => updateFormData("courseMatrix", data)}
                />
                <NavigationButtons />
              </TabsContent>

              <TabsContent value="fee-structure" className="space-y-6">
                <FeeStructureSection
                  data={formData.feeStructure}
                  onChange={(data) => updateFormData("feeStructure", data)}
                />
                <NavigationButtons />
              </TabsContent>

              <TabsContent value="infrastructure" className="space-y-6">
                <InfrastructureSection
                  data={formData.infrastructure}
                  onChange={(data) => updateFormData("infrastructure", data)}
                />
                <NavigationButtons />
              </TabsContent>

              <TabsContent value="declaration" className="space-y-6">
                <DeclarationSection
                  data={formData.declaration}
                  onChange={(data) => updateFormData("declaration", data)}
                />
                <NavigationButtons />
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-tnea-blue mb-2">Review Your Registration</h3>
                    <p className="text-muted-foreground">Please review all information before submitting</p>
                  </div>

                  {/* College Details Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        College Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-medium">College Name:</span> {formData.collegeDetails.collegeName || "Not provided"}</div>
                        <div><span className="font-medium">College Code:</span> {formData.collegeDetails.collegeCode || "Not provided"}</div>
                        <div><span className="font-medium">District:</span> {formData.collegeDetails.district || "Not provided"}</div>
                        <div><span className="font-medium">Type:</span> {formData.collegeDetails.collegeType || "Not provided"}</div>
                        <div><span className="font-medium">Contact Person:</span> {formData.collegeDetails.contactPerson.name || "Not provided"}</div>
                        <div><span className="font-medium">Email:</span> {formData.collegeDetails.contactPerson.email || "Not provided"}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Course Matrix Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Course & Seats ({formData.courseMatrix.length} departments)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {formData.courseMatrix.length > 0 ? (
                        <div className="space-y-2">
                          {formData.courseMatrix.map((course, index) => (
                            <div key={course.id} className="p-3 bg-muted rounded-lg text-sm">
                              <div className="font-medium">{course.department}</div>
                              <div className="grid grid-cols-3 gap-2 mt-1 text-muted-foreground">
                                <div>Total: {course.sanctionedIntake}</div>
                                <div>Govt: {course.govtQuotaSeats}</div>
                                <div>Mgmt: {course.mgmtQuotaSeats}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No courses added</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Fee Structure Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Fee Structure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-medium">Govt Quota Fee:</span> ₹{formData.feeStructure.govtQuotaFee.toLocaleString()}</div>
                        <div><span className="font-medium">Mgmt Quota Fee:</span> ₹{formData.feeStructure.mgmtQuotaFee.toLocaleString()}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Infrastructure Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        Infrastructure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-medium">Hostel:</span> {formData.infrastructure.hostel ? "Available" : "Not Available"}</div>
                        <div><span className="font-medium">Transport:</span> {formData.infrastructure.transport ? "Available" : "Not Available"}</div>
                        <div><span className="font-medium">Internet:</span> {formData.infrastructure.internet ? "Available" : "Not Available"}</div>
                        <div><span className="font-medium">Library Volumes:</span> {formData.infrastructure.libraryVolumes.toLocaleString()}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <NavigationButtons />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};



export default CollegeHome;