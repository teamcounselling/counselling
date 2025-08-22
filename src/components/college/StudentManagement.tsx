import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Eye, Edit, CheckCircle, XCircle, MoreHorizontal, Building, Mail, Phone, MapPin, FileText, User, Calendar, Shield, Download, ExternalLink, Users, Clock, AlertCircle, GraduationCap } from 'lucide-react';
import { studentService, Student, StudentResponse, StudentDocumentsResponse } from '@/services/student/studentService';
import { formatDate } from '@/lib/utils';

export const StudentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [studentDocuments, setStudentDocuments] = useState<Array<{
    id: number;
    student_id: number;
    doc_path: string;
    file_name: string;
    doc_url: string;
    created_at: string;
    updated_at: string;
  }>>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    enrolled: 0,
    pending: 0,
    graduated: 0,
    suspended: 0,
    withdrawn: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getAllStudents();
      setStudents(response.data);
      
      // Calculate statistics
      const total = response.total_records;
      const enrolled = response.data.filter(student => student.status === 'enrolled').length;
      const pending = response.data.filter(student => student.status === 'pending').length;
      const graduated = response.data.filter(student => student.status === 'graduated').length;
      const suspended = response.data.filter(student => student.status === 'suspended').length;
      const withdrawn = response.data.filter(student => student.status === 'withdrawn').length;
      
      setStats({ total, enrolled, pending, graduated, suspended, withdrawn });
      setError(null);
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'enrolled':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Enrolled</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'graduated':
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Graduated</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'withdrawn':
        return <Badge variant="secondary">Withdrawn</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getActiveStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        <Shield className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleView = (studentId: number) => {
    const student = students.find(s => s.user_id === studentId);
    if (student) {
      setSelectedStudent(student);
      navigate(`/admin/students/${studentId}`);
    }
  };

  const handleEdit = (studentId: number) => {
    navigate(`/admin/students/${studentId}/edit`);
  };

  const handleViewDocuments = async (studentId: number) => {
    try {
      setDocumentsLoading(true);
      const response: StudentDocumentsResponse = await studentService.getStudentDocuments(studentId);
      setStudentDocuments(response.data);
      setShowDocumentsDialog(true);
    } catch (err) {
      console.error('Error fetching student documents:', err);
      setError('Failed to fetch student documents');
    } finally {
      setDocumentsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Student Management
          </CardTitle>
          <CardDescription>
            Manage students, their enrollment status, and academic information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All registered students
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.enrolled}</div>
                <p className="text-xs text-muted-foreground">
                  Currently enrolled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Students</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting enrollment
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Graduated Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.graduated}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspended Students</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
                <p className="text-xs text-muted-foreground">
                  Temporarily suspended
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Withdrawn Students</CardTitle>
                <XCircle className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{stats.withdrawn}</div>
                <p className="text-xs text-muted-foreground">
                  Withdrawn from program
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Students Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Enrollment Date</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 && (
                  <TableRow key="no-students">
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No students found
                    </TableCell>
                  </TableRow>
                )}
                {students.map((student) => (
                  <TableRow key={student.user_id}>
                    <TableCell className="font-medium">
                      {student.first_name} {student.last_name}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone || 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                    <TableCell>{getActiveStatusBadge(student.is_active)}</TableCell>
                    <TableCell>
                      {student.enrollment_date ? formatDate(student.enrollment_date) : 'N/A'}
                    </TableCell>
                    <TableCell>{formatDate(student.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          
                          <DropdownMenuItem onClick={() => handleView(student.user_id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewDocuments(student.user_id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Documents
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Documents Dialog */}
      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Student Documents</DialogTitle>
            <DialogDescription>
              View and manage student documents
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {documentsLoading ? (
              <div className="text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Loading documents...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the documents...</p>
              </div>
            ) : studentDocuments.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No documents found for this student.</p>
                <p className="text-sm">Documents will appear here once they are uploaded.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Found {studentDocuments.length} document{studentDocuments.length !== 1 ? 's' : ''}
                </div>
                <div className="grid gap-4">
                  {studentDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <div className="font-medium">{doc.file_name}</div>
                          <div className="text-sm text-muted-foreground">
                            Uploaded: {formatDate(doc.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.doc_url, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
