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
import { Eye, Edit, CheckCircle, XCircle, MoreHorizontal, Building, Mail, Phone, MapPin, FileText, User, Calendar, Shield, Download, ExternalLink, Users, Clock, AlertCircle } from 'lucide-react';
import { adminService, CollegeUser, CollegeUserResponse, CollegeDocumentsResponse } from '@/services/admin/adminService';
import { formatDate } from '@/lib/utils';

const CollegeManagement: React.FC = () => {
  const navigate = useNavigate();
  const [collegeUsers, setCollegeUsers] = useState<CollegeUserResponse>({data: [], total_records: 0});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCollegeUser, setSelectedCollegeUser] = useState<CollegeUser | null>(null);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  
  // New state for documents
  const [collegeDocuments, setCollegeDocuments] = useState<Array<{
    id: number;
    college_id: number;
    doc_path: string;
    file_name: string;
    doc_url: string;
    created_at: string;
    updated_at: string;
  }>>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  
  // New state for confirmation dialogs
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'toggle' | null>(null);
  const [confirmUserId, setConfirmUserId] = useState<number | null>(null);
  const [confirmNotes, setConfirmNotes] = useState('');
  const [confirmDialogTitle, setConfirmDialogTitle] = useState('');
  const [confirmDialogDescription, setConfirmDialogDescription] = useState('');

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchCollegeUsers();
  }, []);

  const fetchCollegeUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCollegeUsers();
      setCollegeUsers(response);
      
      // Calculate statistics
      const total = response.total_records;
      const verified = response.data.filter(user => user.verification_status === 'approved').length;
      const pending = response.data.filter(user => user.verification_status === 'pending' || user.verification_status === 'under_review').length;
      const rejected = response.data.filter(user => user.verification_status === 'rejected').length;
      
      setStats({ total, verified, pending, rejected });
      setError(null);
    } catch (err) {
      setError('Failed to fetch college users');
      console.error('Error fetching college users:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not_submitted':
        return <Badge variant="secondary">Not Submitted</Badge>;
      case 'submitted':
        return <Badge variant="outline">Submitted</Badge>;
      case 'under_review':
        return <Badge variant="default">Under Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getVerificationStatusBadge = (isVerified: boolean) => {
    return isVerified ? (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        <Shield className="w-3 h-3 mr-1" />
        Verified
      </Badge>
    ) : (
      <Badge variant="secondary">
        <Shield className="w-3 h-3 mr-1" />
        Not Verified
      </Badge>
    );
  };

  const getActiveStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid Date';
    }
  };

  const handleView = (userId: number) => {
    const user = collegeUsers.data.find(u => u.user_id === userId);
    if (user) {
      setSelectedCollegeUser(user);
      navigate(`/admin/colleges/${userId}`);
    }
  };

  const handleEdit = (userId: number) => {
    navigate(`/admin/colleges/${userId}/edit`);
  };

  const showConfirmationDialog = (action: 'approve' | 'reject' | 'toggle', userId: number, title: string, description: string) => {
    setConfirmAction(action);
    setConfirmUserId(userId);
    setConfirmDialogTitle(title);
    setConfirmDialogDescription(description);
    setConfirmNotes('');
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    if (!confirmAction || !confirmUserId) return;

    // For rejection, notes are mandatory
    if (confirmAction === 'reject' && !confirmNotes.trim()) {
      alert('Rejection reason is required. Please provide a reason for rejection.');
      return;
    }

    switch (confirmAction) {
      case 'approve':
        updateCollegeStatus(confirmUserId, confirmNotes, 'approved', null);
        break;
      case 'reject':
        updateCollegeStatus(confirmUserId, confirmNotes, 'rejected', confirmNotes);
        break;
    }

    setShowConfirmDialog(false);
    setConfirmAction(null);
    setConfirmUserId(null);
    setConfirmNotes('');
  };

  const handleApprove = (userId: number) => {
    const user = collegeUsers.data.find(u => u.user_id === userId);
    if (user?.verification_status === 'approved') return;
    
    showConfirmationDialog(
      'approve',
      userId,
      'Approve College User',
      'Are you sure you want to approve this college user? Please add any notes below.'
    );
  };

  const updateCollegeStatus = async (userId: number, notes: string, status: string, reason: string) => {
    const data = {
      is_approved: status === 'approved' ? true : false,
      notes: notes,
      rejected_reason: reason ? reason : null
    };
    await adminService.approveCollege(userId, data);
    
    // Here you would typically make an API call to update the status
    console.log(`Approving user ${userId} with notes: ${notes}`);
  };

  const handleReject = (userId: number) => {
    const user = collegeUsers.data.find(u => u.user_id === userId);
    if (user?.verification_status === 'rejected') return;
    
    showConfirmationDialog(
      'reject',
      userId,
      'Reject College User',
      'Are you sure you want to reject this college user? A rejection reason is required below.'
    );
  };

  const rejectUser = (userId: number, notes: string) => {
    setCollegeUsers(prevState => ({
      ...prevState,
      data: prevState.data.map(user =>
        user.user_id === userId ? { ...user, verification_status: 'rejected' } : user
      )
    }));
    
    // Here you would typically make an API call to update the status
    console.log(`Rejecting user ${userId} with notes: ${notes}`);
  };

  const handleToggleStatus = (userId: number) => {
    showConfirmationDialog(
      'toggle',
      userId,
      'Toggle User Status',
      'Are you sure you want to change the active status of this college user? Please add any notes below.'
    );
  };

  const toggleUserStatus = (userId: number, notes: string) => {
    setCollegeUsers(prevState => ({
      ...prevState,
      data: prevState.data.map(user =>
        user.user_id === userId ? { ...user, is_active: !user.is_active } : user
      )
    }));
    
    // Here you would typically make an API call to update the status
    console.log(`Toggling status for user ${userId} with notes: ${notes}`);
  };

  const handleViewDocuments = async (userId: number) => {
    const user = collegeUsers.data.find(u => u.user_id === userId);
    if (user) {
      console.log('User data:', user);
      console.log('College profile:', user.college_profile);
      setSelectedCollegeUser(user);
      setShowDocumentsDialog(true);
      
      // Get college_id from user's profile to fetch documents
      if (user.college_profile?.id) {
        try {
          setDocumentsLoading(true);
          console.log('Fetching documents for college_id:', user.college_profile.id);
          const documentsResponse = await adminService.getCollegeDocuments(user.college_profile.id);
          console.log('Documents response:', documentsResponse);
          setCollegeDocuments(documentsResponse.data);
        } catch (error) {
          console.error('Error fetching documents:', error);
          setCollegeDocuments([]);
        } finally {
          setDocumentsLoading(false);
        }
      } else {
        console.log('No college_id found in profile');
        setCollegeDocuments([]);
        setDocumentsLoading(false);
      }
    }
  };



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
            <Building className="h-5 w-5" />
            College User Management
          </CardTitle>
          <CardDescription>
            Manage college users, their verification status, and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Colleges</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All registered colleges
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified Colleges</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                <p className="text-xs text-muted-foreground">
                  Status: Approved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">
                  Status: Pending/Under Review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected Colleges</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <p className="text-xs text-muted-foreground">
                  Status: Rejected
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Total College Users: {collegeUsers.total_records}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Loading college users...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the data...</p>
            </div>
          ) : collegeUsers.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No college users found</p>
              <p className="text-sm text-gray-500 mt-2">No college users have been registered yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>College User</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Profile Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collegeUsers.data.map((collegeUser) => (
                    <TableRow key={collegeUser.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {collegeUser.first_name} {collegeUser.last_name}
                            </div>
                            <p className="text-sm text-muted-foreground">Code: {collegeUser.college_profile?.college_code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4" />
                            {collegeUser.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4" />
                            {collegeUser.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getActiveStatusBadge(collegeUser.is_active)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            {getStatusBadge(collegeUser.verification_status)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {formatDateTime(collegeUser.last_login)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          {formatDate(collegeUser.created_at)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(collegeUser.user_id)}
                            className="h-8 w-8 p-0"
                            title='View Details'
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {collegeUser.verification_status !== 'approved' && collegeUser.verification_status !== 'rejected' && (
                          <><Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(collegeUser.user_id)}
                              disabled={collegeUser.verification_status === 'approved'}
                              className="h-8 w-8 p-0"
                              title='Approve User'
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(collegeUser.user_id)}
                              disabled={collegeUser.verification_status === 'rejected'}
                              className="h-8 w-8 p-0"
                              title='Reject User'
                            >
                                <XCircle className="h-4 w-4" />
                              </Button></>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDocuments(collegeUser.user_id)}
                            className="h-8 w-8 p-0"
                            title='View Documents'
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(collegeUser.user_id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(collegeUser.user_id)}>
                                {collegeUser.is_active ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Documents Dialog */}
      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Documents for {selectedCollegeUser?.first_name} {selectedCollegeUser?.last_name}
            </DialogTitle>
            <DialogDescription>
              View and manage user documents and verification materials
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {!selectedCollegeUser?.college_profile?.id ? (
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No college profile found for this user.</p>
                <p className="text-sm">Documents cannot be displayed without a valid college profile.</p>
              </div>
            ) : documentsLoading ? (
              <div className="text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Loading documents...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the documents...</p>
              </div>
            ) : collegeDocuments.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No documents found for this college.</p>
                <p className="text-sm">Documents will appear here once they are uploaded.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Found {collegeDocuments.length} document{collegeDocuments.length !== 1 ? 's' : ''}
                </div>
                <div className="grid gap-4">
                  {collegeDocuments.map((doc) => (
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

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialogTitle}</DialogTitle>
            <DialogDescription>
              {confirmDialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="notes">
              {confirmAction === 'reject' ? 'Rejection Reason *' : 'Notes'}
            </Label>
            <Textarea
              id="notes"
              placeholder={
                confirmAction === 'reject' 
                  ? "Enter the reason for rejection (required)..." 
                  : "Enter any additional notes or comments..."
              }
              value={confirmNotes}
              onChange={(e) => setConfirmNotes(e.target.value)}
              className="mt-2"
              rows={3}
              required={confirmAction === 'reject'}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollegeManagement;
