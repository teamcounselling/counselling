import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Building, 
  GraduationCap, 
  Shield,
  User,
  XCircle,
  CheckCircle,
  FileText,
  Edit,
  Eye,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Award,
  Users,
  Home,
  Car,
  Wifi,
  FlaskConical,
  Briefcase,
  Banknote,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { adminService, College, AdminUser, Student } from '@/services/admin/adminService';
import { DocumentViewer } from '@/components/common/DocumentViewer';

// Define the comprehensive college data structure
interface CollegeData {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    is_active: boolean;
    is_verified: boolean;
    last_login: string;
    created_at: string;
    updated_at: string;
  };
  college_profile: {
    id: number;
    college_name: string;
    college_code: string;
    address: string;
    district: string;
    state: string;
    contact_person: string;
    contact_phone: string;
    website: string;
    is_approved: boolean;
    approved_by_user_id: number | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
  };
  college: {
    id: number;
    college_code: string;
    name: string;
    short_name: string;
    type: string;
    university_affiliation: string;
    year_established: number;
    naac_grade: string;
    nba_status: boolean;
    aicte_approved: boolean;
    counselling_type: string;
    address_line1: string;
    address_line2: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    phone: string;
    mobile: string;
    email: string;
    website: string;
    logo_url: string;
    created_at: string;
    updated_at: string;
  };
  principal: {
    id: number;
    name: string;
    designation: string;
    phone: string;
    email: string;
    id_proof_url: string;
    created_at: string;
    updated_at: string;
  };
  seat_matrix: Array<{
    id: number;
    course_name: string;
    intake_capacity: number;
    general_seats: number;
    sc_seats: number;
    st_seats: number;
    obc_seats: number;
    minority_seats: number;
    created_at: string;
    updated_at: string;
  }>;
  facilities: {
    id: number;
    hostel_available: boolean;
    transport_available: boolean;
    wifi_available: boolean;
    lab_facilities: string;
    placement_cell: boolean;
    created_at: string;
    updated_at: string;
  };
  documents: Array<{
    id: number;
    doc_url: string;
    file_name: string;
    created_at: string;
    updated_at: string;
  }>;
  bank_details: {
    id: number;
    bank_name: string;
    branch: string;
    account_number: string;
    ifsc_code: string;
    upi_id: string;
    cancelled_cheque_url: string;
    created_at: string;
    updated_at: string;
  };
  verification_status: {
    id: number;
    is_verified: boolean;
    verified_by: number;
    verification_notes: string;
    rejected_reason: string | null;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

interface StudentData {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    is_active: boolean;
    is_verified: boolean;
    last_login: string;
    created_at: string;
    updated_at: string;
  };
  student: {
    id: number;
    user_id: number;
    date_of_birth: string;
    gender: string;
    address_line1: string;
    address_line2: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    parent_name: string;
    parent_phone: string;
    parent_email: string;
    caste_category: string;
    annual_income: number;
    minority_status: boolean;
    physically_challenged: boolean;
    sports_quota: boolean;
    ncc_quota: boolean;
    created_at: string;
    updated_at: string;
  };
  documents: Array<{
    id: number;
    student_id: number;
    document_type: string;
    doc_path: string;
    file_name: string;
    doc_url: string;
    created_at: string;
    updated_at: string;
  }>;
  verification_status: {
    id: number;
    status: string;
    remarks: string | null;
    verified_by_user_id: number | null;
    verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

interface EntitySlugPageProps {
  entityType: 'college' | 'student' | 'admin';
}

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case 'college':
      return <Building className="w-8 h-8 text-blue-600" />;
    case 'student':
      return <GraduationCap className="w-8 h-8 text-green-600" />;
    case 'admin':
      return <Shield className="w-8 h-8 text-purple-600" />;
    default:
      return <User className="w-8 h-8 text-gray-600" />;
  }
};

const getEntityTitle = (entityType: string) => {
  switch (entityType) {
    case 'college':
      return 'College Details';
    case 'student':
      return 'Student Details';
    case 'admin':
      return 'Administrator Details';
    default:
      return 'Entity Details';
  }
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'approved':
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    case 'inactive':
      return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getVerificationStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        Approved
      </Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Pending
      </Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Rejected
      </Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

const isStudentData = (entity: College | AdminUser | Student | CollegeData | StudentData | null): entity is StudentData => {
  return entity !== null && 'user' in entity && 'student' in entity && 'verification_status' in entity;
};

export const EntitySlugPage: React.FC<EntitySlugPageProps> = ({ entityType }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<College | AdminUser | Student | CollegeData | StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ url: string; name: string } | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);

  // Sample documents data
  const sampleDocuments = [
    {
      id: 1,
      name: "College Registration Certificate",
      type: "PDF",
      size: "2.5 MB",
      uploadedAt: "2025-08-03",
      url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO8DQoxIDAgb2JqDQo8PA0KL1R5cGUgL0NhdGFsb2cNCi9QYWdlcyAyIDAgUg0KPj4NCmVuZG9iag0KMiAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0tpZHMgWzMgMCBSXQ0KL0NvdW50IDEwDQo+Pg0KZW5kb2JqDQozIDAgb2JqDQo8PA0KL1R5cGUgL1BhZ2UNCi9QYXJlbnQgMiAwIFINCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdDQovQ29udGVudHMgNCAwIFINCj4+DQplbmRvYmoNCjQgMCBvYmoNCjw8DQovTGVuZ3RoIDQ0DQo+Pg0Kc3RyZWFtDQpCVA0KL0YxIDEyIFRmDQo3MiA3MjAgVGQNCihDb2xsZWdlIFJlZ2lzdHJhdGlvbiBDZXJ0aWZpY2F0ZSkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KeHJlZg0KMCA1DQowMDAwMDAwMDAwIDY1NTM1IGYgDQowMDAwMDAwMDA5IDAwMDAwIG4gDQowMDAwMDAwMDA1OCAwMDAwMCBuIA0KMDAwMDAwMDAxMTUgMDAwMDAgbiANCjAwMDAwMDAwMjA0IDAwMDAwIG4gDQp0cmFpbGVyDQo8PA0KL1NpemUgNQ0KL1Jvb3QgMSAwIFINCj4+DQpzdGFydHhyZWYNCjI5Nw0KJSVFT0Y="
    },
    {
      id: 2,
      name: "AICTE Approval Letter",
      type: "PDF",
      size: "1.8 MB",
      uploadedAt: "2025-08-03",
      url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO8DQoxIDAgb2JqDQo8PA0KL1R5cGUgL0NhdGFsb2cNCi9QYWdlcyAyIDAgUg0KPj4NCmVuZG9iag0KMiAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0tpZHMgWzMgMCBSXQ0KL0NvdW50IDEwDQo+Pg0KZW5kb2JqDQozIDAgb2JqDQo8PA0KL1R5cGUgL1BhZ2UNCi9QYXJlbnQgMiAwIFINCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdDQovQ29udGVudHMgNCAwIFINCj4+DQplbmRvYmoNCjQgMCBvYmoNCjw8DQovTGVuZ3RoIDQ0DQo+Pg0Kc3RyZWFtDQpCVA0KL0YxIDEyIFRmDQo3MiA3MjAgVGQNCihBSUNURSBBcHByb3ZhbCBMZXR0ZXIpIFRqDQpFVA0KZW5kc3RyZWFtDQplbmRvYmoNCnhscmVmDQowIDUNCjAwMDAwMDAwMDAgNjU1MzUgZiANCjAwMDAwMDAwMDkgMDAwMDAgbiANCjAwMDAwMDAwMDU4IDAwMDAwIG4gDQowMDAwMDAwMDExNSAwMDAwMCBuIA0KMDAwMDAwMDAyMDQgMDAwMDAgbiANCnRyYWlsZXINCjw8DQovU2l6ZSA1DQovUm9vdCAxIDAgUg0KPj4NCnN0YXJ0eHJlZg0KMjk3DQolJUVPRg=="
    },
    {
      id: 3,
      name: "NAAC Certificate",
      type: "PDF",
      size: "3.2 MB",
      uploadedAt: "2025-08-03",
      url: "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO8DQoxIDAgb2JqDQo8PA0KL1R5cGUgL0NhdGFsb2cNCi9QYWdlcyAyIDAgUg0KPj4NCmVuZG9iag0KMiAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0tpZHMgWzMgMCBSXQ0KL0NvdW50IDEwDQo+Pg0KZW5kb2JqDQozIDAgb2JqDQo8PA0KL1R5cGUgL1BhZ2UNCi9QYXJlbnQgMiAwIFINCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdDQovQ29udGVudHMgNCAwIFINCj4+DQplbmRvYmoNCjQgMCBvYmoNCjw8DQovTGVuZ3RoIDQ0DQo+Pg0Kc3RyZWFtDQpCVA0KL0YxIDEyIFRmDQo3MiA3MjAgVGQNCihOQUFDIENlcnRpZmljYXRlKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQp4cmVmDQowIDUNCjAwMDAwMDAwMDAgNjU1MzUgZiANCjAwMDAwMDAwMDkgMDAwMDAgbiANCjAwMDAwMDAwMDU4IDAwMDAwIG4gDQowMDAwMDAwMDExNSAwMDAwMCBuIA0KMDAwMDAwMDAyMDQgMDAwMDAgbiANCnRyYWlsZXINCjw8DQovU2l6ZSA1DQovUm9vdCAxIDAgUg0KPj4NCnN0YXJ0eHJlZg0KMjk3DQolJUVPRg=="
    },
    {
      id: 4,
      name: "Infrastructure Photos",
      type: "ZIP",
      size: "15.7 MB",
      uploadedAt: "2025-08-03",
      url: "data:application/zip;base64,UEsDBBQAAAAIAAAAIQAAAAAAAAAAAAAAAAAAAAAAABAAZmlsZS50eHQFAAAAAA=="
    }
  ];

  useEffect(() => {
    const fetchEntity = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        let data;
        switch (entityType) {
          case 'college':
            data = await adminService.getCollegeById(parseInt(id));
            break;
          case 'student':
            data = await adminService.getStudentByUserId(parseInt(id));
            break;
          case 'admin':
            data = await adminService.getUserById(parseInt(id));
            break;
          default:
            throw new Error('Invalid entity type');
        }

        setEntity(data);
      } catch (err) {
        console.error(`Error fetching ${entityType}:`, err);
        setError(err instanceof Error ? err.message : `Failed to fetch ${entityType}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEntity();
  }, [id, entityType]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleApprove = (collegeId: number) => {
    setActionType('approve');
    setNotes('');
    setIsBlocking(false);
    setActionDialogOpen(true);
  };

  const handleReject = (collegeId: number) => {
    setActionType('reject');
    setNotes('');
    setIsBlocking(false);
    setActionDialogOpen(true);
  };

  const handleActionSubmit = async () => {
    if (!entity || !actionType || entityType !== 'college') return;

    try {
      let collegeId: number;
      if ('college' in entity && typeof entity.college === 'object' && entity.college !== null) {
        // This handles CollegeData structure
        collegeId = entity.college.id;
      } else if ('id' in entity && typeof entity.id === 'number') {
        // This handles College (simple interface) structure
        collegeId = entity.id;
      } else {
        throw new Error("Invalid college entity structure for approval/rejection.");
      }

      if (actionType === 'approve') {
        const updatedCollege = await adminService.approveCollege(collegeId, notes);
        setEntity(updatedCollege);
        console.log('Approved college:', collegeId, 'with notes:', notes);
      } else if (actionType === 'reject') {
        await adminService.rejectCollege(collegeId, notes);
        console.log('Rejected college:', collegeId, 'with reason:', notes);
        // Navigate back to college list
        navigate('/admin/colleges');
      }

      // Close dialog and reset state
      setActionDialogOpen(false);
      setActionType(null);
      setNotes('');
      setIsBlocking(false);
    } catch (err) {
      console.error(`Error ${actionType}ing college:`, err);
      setError(`Failed to ${actionType} college`);
    }
  };

  const handleBlockUser = async () => {
    if (!entity) return;
    setIsBlocking(true);
    
    try {
      let userIdToBlock: number;
      if ('user' in entity && typeof entity.user === 'object' && entity.user !== null) {
        // Handles CollegeData and StudentData structures
        userIdToBlock = entity.user.id;
      } else if ('id' in entity && typeof entity.id === 'number') {
        // Handles AdminUser structure
        userIdToBlock = entity.id;
      } else {
        throw new Error("Invalid entity structure for blocking user.");
      }

      await adminService.blockUser(userIdToBlock);
      console.log('Blocked user:', userIdToBlock);
      
      setEntity(prev => {
        if (prev && 'user' in prev) {
          return { ...prev, user: { ...prev.user, is_active: false } };
        } else if (prev && 'is_active' in prev) { // For AdminUser directly
          return { ...prev, is_active: false };
        }
        return prev;
      });
      
      setActionDialogOpen(false);
      setNotes('');
    } catch (err) {
      console.error('Error blocking user:', err);
      setError(err instanceof Error ? err.message : "Failed to block user");
    } finally {
      setIsBlocking(false);
    }
  };

  const handleViewDocuments = () => {
    setDocumentsDialogOpen(true);
  };

  const handleViewDocument = (document: { url: string; name: string }) => {
    setSelectedDocument(document);
    setDocumentViewerOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading {entityType} details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <div className="flex items-center">
            <XCircle className="h-6 w-6 text-red-400 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Error loading {entityType}</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <Button
                variant="outline"
                onClick={handleBack}
                className="mt-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="text-muted-foreground">
            {getEntityIcon(entityType)}
            <p className="mt-2">No {entityType} found</p>
            <Button variant="outline" onClick={handleBack} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if this is the comprehensive college data structure
  const isComprehensiveCollegeData = entityType === 'college' && 'college_profile' in entity;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            {getEntityIcon(entityType)}
            <h1 className="text-2xl font-semibold">{getEntityTitle(entityType)}</h1>
          </div>
        </div>
        
        {/* Action Buttons for College */}
        {entityType === 'college' && entity && (
          <div className="flex items-center space-x-2">
            <Button
              variant="success"
              size="sm"
              onClick={() => {
                if ('college' in entity) {
                  handleApprove(entity.college.id);
                } else if ('id' in entity) {
                  handleApprove(entity.id);
                }
              }}
              className="h-9 px-4"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if ('college' in entity) {
                  handleReject(entity.college.id);
                } else if ('id' in entity) {
                  handleReject(entity.id);
                }
              }}
              className="h-9 px-4"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDocuments}
              className="h-9 px-4"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Documents
            </Button>
          </div>
        )}
      </div>

      {isComprehensiveCollegeData ? (
        // Comprehensive College Data Display
        <div className="space-y-6">
          {/* College Header Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {entity.college.logo_url && (
                    <img 
                      src={entity.college.logo_url} 
                      alt="College Logo" 
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  )}
                  <div>
                    <CardTitle className="text-2xl">{entity.college.name}</CardTitle>
                    <p className="text-muted-foreground">{entity.college.short_name} • {entity.college.college_code}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {getVerificationStatusBadge(entity.verification_status.status)}
                      {entity.college.aicte_approved && (
                        <Badge className="bg-blue-100 text-blue-800">AICTE Approved</Badge>
                      )}
                      {entity.college.nba_status && (
                        <Badge className="bg-purple-100 text-purple-800">NBA Status</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">College Type</label>
                  <p className="text-sm font-medium">{entity.college.type}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">University Affiliation</label>
                  <p className="text-sm">{entity.college.university_affiliation}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Year Established</label>
                  <p className="text-sm">{entity.college.year_established}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">NAAC Grade</label>
                  <p className="text-sm">{entity.college.naac_grade}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Counselling Type</label>
                  <Badge variant="outline">{entity.college.counselling_type}</Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{formatDate(entity.college.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{entity.college.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{entity.college.phone}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                  <p className="text-sm">{entity.college.mobile}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Website</label>
                  <a href={entity.college.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {entity.college.website}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">{entity.college.address_line1}</p>
                {entity.college.address_line2 && (
                  <p className="text-sm">{entity.college.address_line2}</p>
                )}
                <p className="text-sm">{entity.college.city}, {entity.college.district}, {entity.college.state} - {entity.college.pincode}</p>
              </div>
            </CardContent>
          </Card>

          {/* Principal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Principal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm font-medium">{entity.principal.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Designation</label>
                  <p className="text-sm">{entity.principal.designation}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{entity.principal.phone}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{entity.principal.email}</p>
                </div>
              </div>
              {entity.principal.id_proof_url && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">ID Proof</label>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument({
                        url: entity.principal.id_proof_url,
                        name: "Principal ID Proof"
                      })}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View ID Proof
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seat Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Seat Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entity.seat_matrix.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-3">{course.course_name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div>
                        <label className="text-muted-foreground">Total Intake</label>
                        <p className="font-medium">{course.intake_capacity}</p>
                      </div>
                      <div>
                        <label className="text-muted-foreground">General</label>
                        <p className="font-medium">{course.general_seats}</p>
                      </div>
                      <div>
                        <label className="text-muted-foreground">SC</label>
                        <p className="font-medium">{course.sc_seats}</p>
                      </div>
                      <div>
                        <label className="text-muted-foreground">ST</label>
                        <p className="font-medium">{course.st_seats}</p>
                      </div>
                      <div>
                        <label className="text-muted-foreground">OBC</label>
                        <p className="font-medium">{course.obc_seats}</p>
                      </div>
                      <div>
                        <label className="text-muted-foreground">Minority</label>
                        <p className="font-medium">{course.minority_seats}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Facilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Facilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  {entity.facilities.hostel_available ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Hostel Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  {entity.facilities.transport_available ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Transport Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  {entity.facilities.wifi_available ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">WiFi Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  {entity.facilities.placement_cell ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm">Placement Cell</span>
                </div>
              </div>
              {entity.facilities.lab_facilities && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">Lab Facilities</label>
                  <p className="text-sm mt-1">{entity.facilities.lab_facilities}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5" />
                Bank Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
                  <p className="text-sm">{entity.bank_details.bank_name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Branch</label>
                  <p className="text-sm">{entity.bank_details.branch}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                  <p className="text-sm font-mono">{entity.bank_details.account_number}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">IFSC Code</label>
                  <p className="text-sm font-mono">{entity.bank_details.ifsc_code}</p>
                </div>
                {entity.bank_details.upi_id && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">UPI ID</label>
                    <p className="text-sm">{entity.bank_details.upi_id}</p>
                  </div>
                )}
              </div>
              {entity.bank_details.cancelled_cheque_url && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">Cancelled Cheque</label>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument({
                        url: entity.bank_details.cancelled_cheque_url,
                        name: "Cancelled Cheque"
                      })}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Cheque
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div>{getVerificationStatusBadge(entity.verification_status.status)}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Verified By</label>
                  <p className="text-sm">User ID: {entity.verification_status.verified_by}</p>
                </div>
                {entity.verification_status.verification_notes && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Verification Notes</label>
                    <p className="text-sm">{entity.verification_status.verification_notes}</p>
                  </div>
                )}
                {entity.verification_status.rejected_reason && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Rejection Reason</label>
                    <p className="text-sm text-red-600">{entity.verification_status.rejected_reason}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Verified At</label>
                  <p className="text-sm">{formatDate(entity.verification_status.updated_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Original Entity Details Display
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getEntityIcon(entityType)}
                <span>
                {entityType === 'college' && 'name' in entity ? entity.name : 
                 entityType === 'student' && 'user' in entity ? `${entity.user.first_name} ${entity.user.last_name}` :
                 entityType === 'admin' && 'first_name' in entity ? `${entity.first_name} ${entity.last_name}` : 'Unknown'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID</label>
                <p className="text-sm font-mono">
                  {'college' in entity ? entity.college.id : 
                   'student' in entity ? entity.user.id : entity.id}
                </p>
              </div>

              {entityType === 'college' && 'college_code' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">College Code</label>
                  <p className="text-sm font-mono">{entity.college_code}</p>
                </div>
              )}

              {entityType === 'college' && 'type' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <Badge variant="outline" className="capitalize">{entity.type}</Badge>
                </div>
              )}

              {entityType === 'college' && 'email' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{entity.email}</p>
                </div>
              )}

              {entityType === 'college' && 'phone' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{entity.phone}</p>
                </div>
              )}

              {entityType === 'college' && 'mobile' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                  <p className="text-sm">{entity.mobile}</p>
                </div>
              )}

              {entityType === 'college' && 'website' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Website</label>
                  <p className="text-sm">{entity.website}</p>
                </div>
              )}

              {entityType === 'college' && 'university_affiliation' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">University Affiliation</label>
                  <p className="text-sm">{entity.university_affiliation}</p>
                </div>
              )}

              {entityType === 'college' && 'year_established' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Year Established</label>
                  <p className="text-sm">{entity.year_established}</p>
                </div>
              )}

              {entityType === 'college' && 'naac_grade' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">NAAC Grade</label>
                  <p className="text-sm">{entity.naac_grade}</p>
                </div>
              )}

              {entityType === 'college' && 'counselling_type' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Counselling Type</label>
                  <Badge variant="outline" className="capitalize">{entity.counselling_type}</Badge>
                </div>
              )}

              {entityType === 'college' && 'city' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-sm">{entity.city}, {entity.district}, {entity.state} - {entity.pincode}</p>
                </div>
              )}

              {entityType === 'college' && 'address_line1' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="text-sm">{entity.address_line1}</p>
                  {entity.address_line2 && <p className="text-sm">{entity.address_line2}</p>}
                </div>
              )}

              {entityType === 'student' && 'user' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{entity.user.email}</p>
                </div>
              )}

              {entityType === 'admin' && 'email' in entity && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{entity.email}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  {entityType === 'student' && 'user' in entity ? getStatusBadge(entity.user.is_active ? 'active' : 'inactive') :
                   entityType === 'admin' && 'is_active' in entity ? getStatusBadge(entity.is_active ? 'active' : 'inactive') : 
                   <Badge variant="outline">Active</Badge>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-sm">
                  {formatDate('college' in entity ? entity.college.created_at : 
                              'user' in entity ? entity.user.created_at : entity.created_at)}
                </p>
              </div>

              {'updated_at' in entity && entity.updated_at && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{formatDate(entity.updated_at)}</p>
                </div>
              )}
            </div>

            {/* Student Specific Information */}
            {entityType === 'student' && 'user' in entity && 'student' in entity && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Student Profile</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entity.user.email && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-sm">{entity.user.email}</p>
                      </div>
                    )}
                    
                    {entity.user.phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-sm">{entity.user.phone}</p>
                      </div>
                    )}

                    {entity.student.date_of_birth && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                        <p className="text-sm">{formatDate(entity.student.date_of_birth)}</p>
                      </div>
                    )}

                    {entity.student.gender && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Gender</label>
                        <p className="text-sm">{entity.student.gender}</p>
                      </div>
                    )}

                    {entity.student.caste_category && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Caste Category</label>
                        <p className="text-sm">{entity.student.caste_category}</p>
                      </div>
                    )}

                    {entity.student.annual_income && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Annual Income</label>
                        <p className="text-sm">₹{entity.student.annual_income.toLocaleString()}</p>
                      </div>
                    )}

                    {entity.student.address_line1 && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="text-sm">{entity.student.address_line1}</p>
                        {entity.student.address_line2 && <p className="text-sm">{entity.student.address_line2}</p>}
                        <p className="text-sm">{entity.student.city}, {entity.student.district}, {entity.student.state} - {entity.student.pincode}</p>
                      </div>
                    )}

                    {entity.student.parent_name && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Parent Name</label>
                        <p className="text-sm">{entity.student.parent_name}</p>
                      </div>
                    )}

                    {entity.student.parent_phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Parent Phone</label>
                        <p className="text-sm">{entity.student.parent_phone}</p>
                      </div>
                    )}

                    {entity.student.parent_email && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Parent Email</label>
                        <p className="text-sm">{entity.student.parent_email}</p>
                      </div>
                    )}

                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Quota Status</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {entity.student.minority_status && <Badge variant="outline">Minority</Badge>}
                        {entity.student.physically_challenged && <Badge variant="outline">Physically Challenged</Badge>}
                        {entity.student.sports_quota && <Badge variant="outline">Sports Quota</Badge>}
                        {entity.student.ncc_quota && <Badge variant="outline">NCC Quota</Badge>}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Verification Status */}
            {entityType === 'student' && isStudentData(entity) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Verification Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="mt-1">
                        {getVerificationStatusBadge(entity.verification_status.status)}
                      </div>
                    </div>
                    
                    {entity.verification_status.remarks && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Remarks</label>
                        <p className="text-sm">{entity.verification_status.remarks}</p>
                      </div>
                    )}

                    {entity.verification_status.verified_at && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Verified At</label>
                        <p className="text-sm">{formatDate(entity.verification_status.verified_at)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Documents Section */}
            {entityType === 'student' && isStudentData(entity) && entity.documents.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Documents</h3>
                    <Button variant="outline" onClick={handleViewDocuments}>
                      View All Documents
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {entity.documents.slice(0, 6).map((doc, index) => (
                      <div key={doc.id} className="border rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">{doc.document_type}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{doc.file_name}</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDocument({ url: doc.doc_url, name: doc.file_name })}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                  {entity.documents.length > 6 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Showing 6 of {entity.documents.length} documents
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Dialog for Approve/Reject */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {actionType === 'approve' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span>
                {actionType === 'approve' ? 'Approve' : 'Reject'} College
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {actionType === 'approve' ? 'Notes (Optional)' : 'Rejection Reason'}
              </label>
              <Textarea
                placeholder={
                  actionType === 'approve' 
                    ? 'Add any notes or comments for approval...' 
                    : 'Please provide a reason for rejection...'
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setActionDialogOpen(false);
                  setActionType(null);
                  setNotes('');
                }}
              >
                Cancel
              </Button>
              
              <div className="flex items-center space-x-2">
                {actionType === 'reject' && (
                  <Button
                    variant="destructive"
                    onClick={handleBlockUser}
                    disabled={isBlocking}
                  >
                    {isBlocking ? 'Blocking...' : 'Block User'}
                  </Button>
                )}
                
                <Button
                  variant={actionType === 'approve' ? 'success' : 'destructive'}
                  onClick={handleActionSubmit}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Documents Dialog for College */}
      {entityType === 'college' && (
        <Dialog open={documentsDialogOpen} onOpenChange={setDocumentsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Documents - {isComprehensiveCollegeData ? entity.college.name : (entity && 'name' in entity ? entity.name : 'College')}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid gap-4">
                {isComprehensiveCollegeData ? (
                  // Display actual documents from the data
                  entity.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{document.file_name}</h4>
                          <p className="text-xs text-muted-foreground">
                            Uploaded {formatDate(document.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument({
                            url: document.doc_url,
                            name: document.file_name
                          })}
                          className="h-8 px-3"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback to sample documents
                  sampleDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{document.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {document.type} • {document.size} • Uploaded {document.uploadedAt}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(document)}
                          className="h-8 px-3"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {((isComprehensiveCollegeData && entity.documents.length === 0) || 
                (!isComprehensiveCollegeData && sampleDocuments.length === 0)) && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No documents uploaded yet</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Document Viewer */}
      {selectedDocument && (
        <DocumentViewer
          isOpen={documentViewerOpen}
          onClose={() => {
            setDocumentViewerOpen(false);
            setSelectedDocument(null);
          }}
          documentUrl={selectedDocument.url}
          documentName={selectedDocument.name}
        />
      )}
    </div>
  );
};
