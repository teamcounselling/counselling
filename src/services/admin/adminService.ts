import { apiClient } from '../apiClient';

export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardTiles {
  data: Array<{
    student: {
      label: string;
      value: number;
    };
    college: {
      label: string;
      value: number;
    };
    seats: {
      label: string;
      value: number;
    };
    current_round: {
      label: string;
      value: number;
    };
  }>;
}

export interface College {
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
}

export interface CollegeResponse {
  data: College[];
  total_records: number;
}

export interface CollegeUser {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  is_verified: boolean;
  last_login: string;
  college_profile: {
    id: number;
    college_id: number;
    college_code: string;
    name: string;
    // Add other college profile fields as needed
  } | null;
  verification_status: string;
  created_at: string;
  updated_at: string;
}

export interface CollegeUserResponse {
  data: CollegeUser[];
  total_records: number;
}

export interface Student {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  college_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: number;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

export interface CollegeDocumentsResponse {
  data: Array<{
    id: number;
    college_id: number;
    doc_path: string;
    file_name: string;
    doc_url: string;
    created_at: string;
    updated_at: string;
  }>;
}


class AdminService {
  // private readonly baseUrl = '/admin';

  // User Management
  async getAllUsers(skip: number = 0): Promise<AdminUser[]> {
    const response = await apiClient.get(`/users?skip=${skip}`);
    return response.data;
  }

  async getUserById(userId: number): Promise<AdminUser> {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }

  async createUser(userData: CreateUserRequest): Promise<AdminUser> {
    const response = await apiClient.post(`/users`, userData);
    return response.data;
  }

  async updateUser(userId: number, userData: UpdateUserRequest): Promise<AdminUser> {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId: number): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
  }

  async toggleUserStatus(userId: number): Promise<AdminUser> {
    const response = await apiClient.patch(`/users/${userId}/toggle-status`);
    return response.data;
  }

  // College Management
  async getAllColleges(): Promise<CollegeResponse> {
    const response = await apiClient.get(`/colleges/all`);
    return response.data;
  }

  async getCollegeDocuments(collegeId: number): Promise<CollegeDocumentsResponse> {
    const response = await apiClient.get(`/colleges/${collegeId}/documents`);
    return response.data;
  }

  async getCollegeById(collegeId: number): Promise<College> {
    const response = await apiClient.get(`/colleges/${collegeId}`);
    return response.data.data;
  }

  async approveCollege(collegeId: number, data: unknown): Promise<College> {
    const response = await apiClient.post(`/colleges/${collegeId}/verify`, data);
    return response.data;
  }


  async getAllCollegeUsers(): Promise<CollegeUserResponse> {
    const response = await apiClient.get('/colleges/all');
    console.log('Raw API response:', response);
    
    // Access the response data
    const responseData = response.data;
    console.log('Response data:', responseData);
    
    // Handle potential nested data structure
    if (responseData && responseData.data && Array.isArray(responseData.data)) {
      return {
        data: responseData.data,
        total_records: responseData.total_records || 0
      };
    }
    
    // Handle flat structure
    if (responseData && Array.isArray(responseData)) {
      return {
        data: responseData,
        total_records: responseData.length || 0
      };
    }
    
    // Fallback - return empty response if structure is unexpected
    return {
      data: [],
      total_records: 0
    };
  }

  // New method to approve/reject college users using college_id from profile
  async updateCollegeUserStatus(collegeId: number, data: {
    is_approved: boolean;
    notes: string;
    reason?: string | null;
  }): Promise<CollegeUser> {
    const response = await apiClient.put(`/colleges/${collegeId}/status`, data);
    return response.data;
  }

  // Helper method to get college_id from college_profile
  getCollegeIdFromProfile(collegeUser: CollegeUser): number | null {
    return collegeUser.college_profile?.college_id || null;
  }

  // Helper method to get college profile id from college_profile
  getCollegeProfileId(collegeUser: CollegeUser): number | null {
    return collegeUser.college_profile?.id || null;
  }

  // Student Management
  async getAllStudents(): Promise<Student[]> {
    const response = await apiClient.get(`/students`);
    return response.data;
  }

  async getStudentById(studentId: number): Promise<Student> {
    const response = await apiClient.get(`/students/${studentId}`);
    return response.data;
  }

  async getStudentByUserId(userId: number): Promise<Student> {
    const response = await apiClient.get(`/students/${userId}`);
    return response.data;
  }

  async getStudentsByCollege(collegeId: number): Promise<Student[]> {
    const response = await apiClient.get(`/colleges/${collegeId}/students`);
    return response.data;
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<{
    total_users: number;
    total_colleges: number;
    total_students: number;
    pending_approvals: number;
  }> {
    const response = await apiClient.get(`/dashboard/stats`);
    return response.data;
  }

  // Reports
  async generateUserReport(): Promise<Blob> {
    const response = await apiClient.get(`/reports/users`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async generateCollegeReport(): Promise<Blob> {
    const response = await apiClient.get(`/reports/colleges`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async getDashboardTiles(): Promise<DashboardTiles> {
    try {
      console.log('Making API call to:', `/dashboard-tiles`);
      const response = await apiClient.get(`admin/dashboard-tiles`);
      console.log('API response:', response);
      return response.data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

}

export const adminService = new AdminService(); 