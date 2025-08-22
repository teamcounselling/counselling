import { apiClient } from '../apiClient';

export interface StudentProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  college_id: number;
  college_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  college_id: number;
  college_name: string;
  program?: string;
  year?: string;
  status: 'enrolled' | 'pending' | 'graduated' | 'suspended' | 'withdrawn';
  enrollment_date?: string;
  gpa?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentResponse {
  data: Student[];
  total_records: number;
}

export interface StudentDocumentsResponse {
  data: Array<{
    id: number;
    student_id: number;
    doc_path: string;
    file_name: string;
    doc_url: string;
    created_at: string;
    updated_at: string;
  }>;
}

export interface Program {
  id: number;
  name: string;
  description: string;
  duration: string;
  fee_structure: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  credits: number;
  program_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Counselor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  specialization: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  student_id: number;
  counselor_id: number;
  counselor_name: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentRequest {
  counselor_id: number;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface Enrollment {
  id: number;
  student_id: number;
  program_id: number;
  program_name: string;
  enrollment_date: string;
  status: 'active' | 'completed' | 'dropped';
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: number;
  student_id: number;
  course_id: number;
  course_name: string;
  enrollment_date: string;
  grade?: string;
  status: 'enrolled' | 'completed' | 'dropped';
  created_at: string;
  updated_at: string;
}

class StudentService {
  private readonly baseUrl = '/student';

  // Profile Management
  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get(`${this.baseUrl}/profile`);
    return response.data;
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<StudentProfile> {
    const response = await apiClient.put(`${this.baseUrl}/profile`, profileData);
    return response.data;
  }

  // Program Browsing
  async getAllPrograms(): Promise<Program[]> {
    const response = await apiClient.get(`${this.baseUrl}/programs`);
    return response.data;
  }

  async getProgramById(programId: number): Promise<Program> {
    const response = await apiClient.get(`${this.baseUrl}/programs/${programId}`);
    return response.data;
  }

  async getProgramsByCollege(collegeId: number): Promise<Program[]> {
    const response = await apiClient.get(`${this.baseUrl}/colleges/${collegeId}/programs`);
    return response.data;
  }

  // Course Browsing
  async getAllCourses(): Promise<Course[]> {
    const response = await apiClient.get(`${this.baseUrl}/courses`);
    return response.data;
  }

  async getCourseById(courseId: number): Promise<Course> {
    const response = await apiClient.get(`${this.baseUrl}/courses/${courseId}`);
    return response.data;
  }

  async getCoursesByProgram(programId: number): Promise<Course[]> {
    const response = await apiClient.get(`${this.baseUrl}/programs/${programId}/courses`);
    return response.data;
  }

  // Enrollment Management
  async getMyEnrollments(): Promise<Enrollment[]> {
    const response = await apiClient.get(`${this.baseUrl}/enrollments`);
    return response.data;
  }

  async enrollInProgram(programId: number): Promise<Enrollment> {
    const response = await apiClient.post(`${this.baseUrl}/enrollments`, { program_id: programId });
    return response.data;
  }

  async dropProgram(enrollmentId: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/enrollments/${enrollmentId}`);
  }

  async getMyCourseEnrollments(): Promise<CourseEnrollment[]> {
    const response = await apiClient.get(`${this.baseUrl}/course-enrollments`);
    return response.data;
  }

  async enrollInCourse(courseId: number): Promise<CourseEnrollment> {
    const response = await apiClient.post(`${this.baseUrl}/course-enrollments`, { course_id: courseId });
    return response.data;
  }

  async dropCourse(enrollmentId: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/course-enrollments/${enrollmentId}`);
  }

  // Counselor Management
  async getAllCounselors(): Promise<Counselor[]> {
    const response = await apiClient.get(`${this.baseUrl}/counselors`);
    return response.data;
  }

  async getCounselorById(counselorId: number): Promise<Counselor> {
    const response = await apiClient.get(`${this.baseUrl}/counselors/${counselorId}`);
    return response.data;
  }

  async getAvailableCounselors(): Promise<Counselor[]> {
    const response = await apiClient.get(`${this.baseUrl}/counselors/available`);
    return response.data;
  }

  // Appointment Management
  async getMyAppointments(): Promise<Appointment[]> {
    const response = await apiClient.get(`${this.baseUrl}/appointments`);
    return response.data;
  }

  async getAppointmentById(appointmentId: number): Promise<Appointment> {
    const response = await apiClient.get(`${this.baseUrl}/appointments/${appointmentId}`);
    return response.data;
  }

  async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    const response = await apiClient.post(`${this.baseUrl}/appointments`, appointmentData);
    return response.data;
  }

  async cancelAppointment(appointmentId: number, reason?: string): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/appointments/${appointmentId}/cancel`, { reason });
  }

  async rescheduleAppointment(appointmentId: number, newDate: string, newTime: string): Promise<Appointment> {
    const response = await apiClient.patch(`${this.baseUrl}/appointments/${appointmentId}/reschedule`, {
      date: newDate,
      time: newTime
    });
    return response.data;
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<{
    total_enrollments: number;
    total_course_enrollments: number;
    total_appointments: number;
    upcoming_appointments: number;
    completed_courses: number;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/dashboard/stats`);
    return response.data;
  }

  // Academic Progress
  async getAcademicProgress(): Promise<{
    total_credits_earned: number;
    total_credits_required: number;
    gpa: number;
    completion_percentage: number;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/academic-progress`);
    return response.data;
  }

  async getGradeReport(): Promise<CourseEnrollment[]> {
    const response = await apiClient.get(`${this.baseUrl}/grade-report`);
    return response.data;
  }

  // Notifications
  async getNotifications(): Promise<{
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    is_read: boolean;
    created_at: string;
  }[]> {
    const response = await apiClient.get(`${this.baseUrl}/notifications`);
    return response.data;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/notifications/read-all`);
  }

  // Student Management
  async getAllStudents(): Promise<StudentResponse> {
    const response = await apiClient.get(`/students/all`);
    return response.data;
  }

  async getStudentById(studentId: number): Promise<Student> {
    const response = await apiClient.get(`/api/students/${studentId}`);
    return response.data;
  }

  async getStudentDocuments(studentId: number): Promise<StudentDocumentsResponse> {
    const response = await apiClient.get(`/api/students/${studentId}/documents`);
    return response.data;
  }

  async uploadStudentDocument(studentId: number, file: File): Promise<{ id: number; file_name: string; doc_url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/api/students/${studentId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteStudentDocument(documentId: number): Promise<void> {
    await apiClient.delete(`/api/documents/${documentId}`);
  }
}

export const studentService = new StudentService(); 