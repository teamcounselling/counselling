import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Users, GraduationCap, Building2, Shield, FileText, BarChart3, Settings, Bell, UserCheck, CheckCircle, Clock } from "lucide-react";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

// Components
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminHome from "./pages/admin/AdminHome";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";

// Student Pages
import StudentLogin from "./pages/student/StudentLogin";
import StudentHome from "./components/student/TNEARegistrationForm";

// College Pages
import CollegeLogin from "./pages/college/CollegeLogin";
import CollegeHome from "./pages/college/CollegeHome";
import { UserManagement } from "./components/admin/UserManagement";
import CollegeManagement from "./components/admin/CollegeManagement";
import { CollegeSlugPage } from "./components/admin/CollegeSlugPage";
import { StudentSlugPage } from "./components/admin/StudentSlugPage";
import { AdminSlugPage } from "./components/admin/AdminSlugPage";
import { StudentManagement } from "./components/college/StudentManagement";
import { EntitySlugPage } from "./components/common/EntitySlugPage";
import StageManagement from "./pages/admin/StageManagement";
import CreateStage from "./pages/admin/CreateStage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole={1}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole={1}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin User Management Routes */}
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole={1}>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/users/all" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="All Users" 
                  description="View and manage all users"
                  icon={Users}
                />
              </ProtectedRoute>
            } />
            <Route path="/admin/students" element={
              <ProtectedRoute requiredRole={1}>
                <StudentManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/colleges" element={
              <ProtectedRoute requiredRole={1}>
                <CollegeManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/admins" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="Administrator Management" 
                  description="Manage administrator accounts"
                  icon={Shield}
                />
              </ProtectedRoute>
            } />
            
            {/* Admin Entity Slug Page Routes */}
            <Route path="/admin/colleges/:id" element={
              <ProtectedRoute requiredRole={1}>
                <CollegeSlugPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/students/:id" element={
              <ProtectedRoute requiredRole={1}>
                <StudentSlugPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/admins/:id" element={
              <ProtectedRoute requiredRole={1}>
                <AdminSlugPage />
              </ProtectedRoute>
            } />
            
            {/* Admin Program Management Routes */}
            <Route path="/admin/programs" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="Program Management" 
                  description="Manage all programs in the system"
                  icon={FileText}
                />
              </ProtectedRoute>
            } />
            <Route path="/admin/programs/all" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="All Programs" 
                  description="View and manage all programs"
                  icon={FileText}
                />
              </ProtectedRoute>
            } />
            <Route path="/admin/programs/pending" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="Pending Approvals" 
                  description="Review and approve pending programs"
                  icon={UserCheck}
                />
              </ProtectedRoute>
            } />
            <Route path="/admin/programs/approved" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="Approved Programs" 
                  description="View all approved programs"
                  icon={CheckCircle}
                />
              </ProtectedRoute>
            } />
            
            {/* Admin Reports Routes */}
            <Route path="/admin/reports" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="Reports & Analytics" 
                  description="View system reports and analytics"
                  icon={BarChart3}
                />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports/users" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="User Statistics" 
                  description="View user-related statistics"
                  icon={BarChart3}
                />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports/programs" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="Program Statistics" 
                  description="View program-related statistics"
                  icon={BarChart3}
                />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports/activity" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="Activity Logs" 
                  description="View system activity logs"
                  icon={FileText}
                />
              </ProtectedRoute>
            } />
            
                         {/* Admin Stage Management Routes */}
             <Route path="/admin/stages" element={
               <ProtectedRoute requiredRole={1}>
                 <StageManagement />
               </ProtectedRoute>
             } />
             <Route path="/admin/stages/create" element={
               <ProtectedRoute requiredRole={1}>
                 <CreateStage />
               </ProtectedRoute>
             } />
            
            {/* Admin Settings Routes */}
            <Route path="/admin/settings" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder
                  title="System Settings" 
                  description="Configure system settings"
                  icon={Settings}
                />
              </ProtectedRoute>
            } />
            <Route path="/admin/notifications" element={
              <ProtectedRoute requiredRole={1}>
                <AdminPlaceholder 
                  title="Notifications" 
                  description="Manage system notifications"
                  icon={Bell}
                />
              </ProtectedRoute>
            } />
            
            {/* Student Dashboard Routes */}
            <Route path="/student" element={
              <ProtectedRoute requiredRole={2}>
                <StudentHome />
              </ProtectedRoute>
            } />
            <Route path="/student/dashboard" element={
              <ProtectedRoute requiredRole={2}>
                <StudentHome />
              </ProtectedRoute>
            } />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/programs" element={
              <ProtectedRoute requiredRole={2}>
                <StudentHome />
              </ProtectedRoute>
            } />
            <Route path="/student/appointments" element={
              <ProtectedRoute requiredRole={2}>
                <StudentHome />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute requiredRole={2}>
                <StudentHome />
              </ProtectedRoute>
            } />
            <Route path="/student/settings" element={
              <ProtectedRoute requiredRole={2}>
                <StudentHome />
              </ProtectedRoute>
            } />
            
            {/* College Dashboard Routes */}
            <Route path="/college" element={
              <ProtectedRoute requiredRole={3}>
                <CollegeHome />
              </ProtectedRoute>
            } />
            <Route path="/college/dashboard" element={
              <ProtectedRoute requiredRole={3}>
                <CollegeHome />
              </ProtectedRoute>
            } />
            <Route path="/college/login" element={<CollegeLogin />} />
            <Route path="/college/programs" element={
              <ProtectedRoute requiredRole={3}>
                <CollegeHome />
              </ProtectedRoute>
            } />
            <Route path="/college/programs/my" element={
              <ProtectedRoute requiredRole={3}>
                <CollegeHome />
              </ProtectedRoute>
            } />
            <Route path="/college/programs/create" element={
              <ProtectedRoute requiredRole={3}>
                <CollegeHome />
              </ProtectedRoute>
            } />
            <Route path="/college/programs/pending" element={
              <ProtectedRoute requiredRole={3}>
                <CollegeHome />
              </ProtectedRoute>
            } />
            <Route path="/college/students" element={
              <ProtectedRoute requiredRole={3}>
                <StudentManagement />
              </ProtectedRoute>
            } />
            <Route path="/college/students/:id" element={
              <ProtectedRoute requiredRole={3}>
                <EntitySlugPage entityType="student" />
              </ProtectedRoute>
            } />
            <Route path="/college/reports" element={
              <ProtectedRoute requiredRole={3}>
                <CollegeHome />
              </ProtectedRoute>
            } />
            <Route path="/college/settings" element={
              <ProtectedRoute requiredRole={3}>
                <CollegeHome />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
