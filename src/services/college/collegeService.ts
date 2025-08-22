import { apiClient } from '../apiClient';

export interface CollegeProfile {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  website?: string;
  description?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
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

export interface Student {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  student_id: number;
  counselor_id: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  name?: string;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
}

export interface CreateProgramRequest {
  name: string;
  description: string;
  duration: string;
  fee_structure: string;
}

export interface CreateCourseRequest {
  name: string;
  description: string;
  credits: number;
  program_id: number;
}

export interface CreateAppointmentRequest {
  student_id: number;
  counselor_id: number;
  date: string;
  time: string;
  notes?: string;
}

class CollegeService {
  private readonly baseUrl = '/college';

  // Profile Management
  async getProfile(): Promise<CollegeProfile> {
    const response = await apiClient.get(`${this.baseUrl}/profile`);
    return response.data;
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<CollegeProfile> {
    const response = await apiClient.put(`${this.baseUrl}/profile`, profileData);
    return response.data;
  }

  // Program Management
  async getAllPrograms(): Promise<Program[]> {
    const response = await apiClient.get(`${this.baseUrl}/programs`);
    return response.data;
  }

  async getProgramById(programId: number): Promise<Program> {
    const response = await apiClient.get(`${this.baseUrl}/programs/${programId}`);
    return response.data;
  }

  async createProgram(programData: CreateProgramRequest): Promise<Program> {
    const response = await apiClient.post(`${this.baseUrl}/programs`, programData);
    return response.data;
  }

  async updateProgram(programId: number, programData: Partial<CreateProgramRequest>): Promise<Program> {
    const response = await apiClient.put(`${this.baseUrl}/programs/${programId}`, programData);
    return response.data;
  }

  async deleteProgram(programId: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/programs/${programId}`);
  }

  async toggleProgramStatus(programId: number): Promise<Program> {
    const response = await apiClient.patch(`${this.baseUrl}/programs/${programId}/toggle-status`);
    return response.data;
  }

  // Course Management
  async getAllCourses(): Promise<Course[]> {
    const response = await apiClient.get(`${this.baseUrl}/courses`);
    return response.data;
  }

  async getCoursesByProgram(programId: number): Promise<Course[]> {
    const response = await apiClient.get(`${this.baseUrl}/programs/${programId}/courses`);
    return response.data;
  }

  async createCourse(courseData: CreateCourseRequest): Promise<Course> {
    const response = await apiClient.post(`${this.baseUrl}/courses`, courseData);
    return response.data;
  }

  async updateCourse(courseId: number, courseData: Partial<CreateCourseRequest>): Promise<Course> {
    const response = await apiClient.put(`${this.baseUrl}/courses/${courseId}`, courseData);
    return response.data;
  }

  async deleteCourse(courseId: number): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/courses/${courseId}`);
  }

  // Student Management
  async getAllStudents(): Promise<Student[]> {
    const response = await apiClient.get(`${this.baseUrl}/students`);
    return response.data;
  }

  async getStudentById(studentId: number): Promise<Student> {
    const response = await apiClient.get(`${this.baseUrl}/students/${studentId}`);
    return response.data;
  }

  async createStudent(studentData: {
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }): Promise<Student> {
    const response = await apiClient.post(`${this.baseUrl}/students`, studentData);
    return response.data;
  }

  async updateStudent(studentId: number, studentData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    is_active?: boolean;
  }): Promise<Student> {
    const response = await apiClient.put(`${this.baseUrl}/students/${studentId}`, studentData);
    return response.data;
  }

  // Appointment Management
  async getAllAppointments(): Promise<Appointment[]> {
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

  async updateAppointmentStatus(appointmentId: number, status: Appointment['status']): Promise<Appointment> {
    const response = await apiClient.patch(`${this.baseUrl}/appointments/${appointmentId}/status`, { status });
    return response.data;
  }

  async cancelAppointment(appointmentId: number, reason?: string): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/appointments/${appointmentId}/cancel`, { reason });
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<{
    total_students: number;
    total_programs: number;
    total_courses: number;
    total_appointments: number;
    pending_appointments: number;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/dashboard/stats`);
    return response.data;
  }

  // Reports
  async generateStudentReport(): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/reports/students`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async generateAppointmentReport(): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/reports/appointments`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const collegeService = new CollegeService(); 