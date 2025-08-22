import { apiClient } from '../apiClient';

export interface Stage {
  id: number;
  stage_type: string; // stage_1, stage_2, stage_3, stage_4, completed
  name: string;
  description: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  allowed_roles: string[];
  blocked_endpoints: string[];
  required_permissions: string[];
}

export interface StageResponse {
  data: Stage[];
  total_records: number;
}

export interface CurrentStageInfo {
  current_stage: Stage;
  allowed_actions: string[];
  blocked_actions: string[];
  stage_info: {
    message: string;
    description: string;
    days_remaining: number;
    progress_percentage: number;
  };
}

export interface RegistrationCheckResponse {
  allowed: boolean;
  current_stage: Stage;
  message: string;
  description: string;
  allowed_actions: string[];
  blocked_actions: string[];
  days_remaining: number;
}

export interface CreateStageRequest {
  stage_type: string;
  name: string;
  description: string;
  is_active?: boolean;
  start_date: string;
  end_date: string;
  allowed_roles: string[];
  blocked_endpoints: string[];
  required_permissions: string[];
}

export interface UpdateStageRequest {
  name?: string;
  description?: string;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  allowed_roles?: string[];
  blocked_endpoints?: string[];
  required_permissions?: string[];
}



class StageService {
  private baseUrl = '/stages';

  // Get all stages
  async getAllStages(): Promise<StageResponse> {
    const response = await apiClient.get(this.baseUrl);
    return response.data;
  }

  // Get current stage information
  async getCurrentStage(): Promise<CurrentStageInfo> {
    const response = await apiClient.get(`${this.baseUrl}/current`);
    return response.data;
  }

  // Create a new stage
  async createStage(stageData: CreateStageRequest): Promise<Stage> {
    const response = await apiClient.post(this.baseUrl, stageData);
    return response.data;
  }

  // Update a stage
  async updateStage(stageId: number, stageData: UpdateStageRequest): Promise<Stage> {
    const response = await apiClient.put(`${this.baseUrl}/${stageId}`, stageData);
    return response.data;
  }

  // Activate a stage
  async activateStage(stageId: number): Promise<{ message: string }> {
    const response = await apiClient.post(`${this.baseUrl}/${stageId}/activate`);
    return response.data;
  }

  // Deactivate a stage
  async deactivateStage(stageId: number): Promise<{ message: string }> {
    const response = await apiClient.post(`${this.baseUrl}/${stageId}/deactivate`);
    return response.data;
  }

  // Initialize default stages
  async initializeDefaultStages(): Promise<{
    message: string;
    stage_ids: number[];
    stages_created: number;
    stages: Array<{ id: number; name: string; stage_type: string }>;
  }> {
    const response = await apiClient.post(`${this.baseUrl}/initialize`);
    return response.data;
  }

  // Check if registration is allowed for a specific role
  async checkRegistrationAllowed(role: string): Promise<RegistrationCheckResponse> {
    const response = await apiClient.get(`${this.baseUrl}/check-registration/${role}`);
    return response.data;
  }

  // Get stage statistics
  // Delete a stage
  async deleteStage(stageId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`${this.baseUrl}/${stageId}`);
    return response.data;
  }

  // Get stage by ID
  async getStageById(stageId: number): Promise<Stage> {
    const response = await apiClient.get(`${this.baseUrl}/${stageId}`);
    return response.data;
  }

}

export const stageService = new StageService();
