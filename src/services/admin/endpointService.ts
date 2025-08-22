import { apiClient } from '../apiClient';

export interface Endpoint {
  path: string;
  methods: string[];
  summary: string;
  tags: string[];
  requires_auth: boolean;
  response_model: string | null;
  full_url: string;
}

export interface EndpointsResponse {
  message: string;
  total_endpoints: number;
  grouped_by_tags: Record<string, Endpoint[]>;
  flat_list: Endpoint[];
  statistics: {
    total_endpoints: number;
    authenticated_endpoints: number;
    public_endpoints: number;
    tags_count: number;
    methods_distribution: Record<string, number>;
  };
}

class EndpointService {
  private baseUrl = '/endpoints';

  // Get all available endpoints
  async getAllEndpoints(): Promise<EndpointsResponse> {
    const response = await apiClient.get(`${this.baseUrl}/list`);
    return response.data;
  }

  // Get endpoints by tag
  async getEndpointsByTag(tag: string): Promise<Endpoint[]> {
    const response = await apiClient.get(`${this.baseUrl}/by-tag/${tag}`);
    return response.data;
  }

  // Get all available tags
  async getTags(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/tags`);
    return response.data;
  }

  // Search endpoints
  async searchEndpoints(query: string): Promise<Endpoint[]> {
    const response = await apiClient.get(`${this.baseUrl}/search?q=${query}`);
    return response.data;
  }

  // Get authenticated endpoints
  async getAuthenticatedEndpoints(): Promise<Endpoint[]> {
    const response = await apiClient.get(`${this.baseUrl}/auth-required`);
    return response.data;
  }

  // Get public endpoints
  async getPublicEndpoints(): Promise<Endpoint[]> {
    const response = await apiClient.get(`${this.baseUrl}/public`);
    return response.data;
  }
}

export const endpointService = new EndpointService();
