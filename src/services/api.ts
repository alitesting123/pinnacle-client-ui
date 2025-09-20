// src/services/api.ts
export interface ApiConfig {
    baseURL: string;
    timeout?: number;
  }
  
  export interface User {
    user_id: string;
    email: string;
    full_name: string;
    company?: string;
    roles: string[];
    department?: string;
  }
  
  // API response types based on your FastAPI backend
  export interface UserResponse {
    user: User;
    error?: string;
  }
  
  export interface ProposalsResponse {
    proposals: any[];
    user?: User;
    message?: string;
  }
  
  export interface QuestionsResponse {
    questions: any[];
    user?: User;
  }
  
  export interface HealthResponse {
    status: string;
    timestamp: string;
    version: string;
    environment: string;
  }
  
  export interface MessageResponse {
    message: string;
    user?: User;
  }
  
  class ApiService {
    private baseURL: string;
    private timeout: number;
  
    constructor(config: ApiConfig) {
      this.baseURL = config.baseURL;
      this.timeout = config.timeout || 10000;
    }
  
    private async request<T = any>(
      endpoint: string,
      options: RequestInit = {}
    ): Promise<T> {
      const url = `${this.baseURL}${endpoint}`;
      
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
  
      // Add mock SSO headers for testing (remove when real SSO is implemented)
      const mockHeaders = this.getMockSSOHeaders();
      
      const config: RequestInit = {
        ...options,
        headers: {
          ...defaultHeaders,
          ...mockHeaders,
          ...options.headers,
        },
      };
  
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
  
        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });
  
        clearTimeout(timeoutId);
  
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data as T;
      } catch (error) {
        console.error('API Request failed:', error);
        throw error;
      }
    }
  
    // Mock SSO headers for testing (replace with real SSO integration later)
    private getMockSSOHeaders(): Record<string, string> {
      return {
        'X-SSO-User': 'frontend-user-123',
        'X-SSO-Email': 'user@company.com',
        'X-SSO-Name': 'Frontend User',
        'X-SSO-Company': 'Test Company',
        'X-SSO-Roles': 'user,admin',
        'X-SSO-Department': 'Engineering'
      };
    }
  
    // API Methods with proper typing
    async getCurrentUser(): Promise<User | null> {
      try {
        const response = await this.request<UserResponse>('/api/v1/users/me');
        return response.user || null;
      } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
      }
    }
  
    async getProposals(): Promise<any[]> {
      try {
        const response = await this.request<ProposalsResponse>('/api/v1/proposals');
        return response.proposals || [];
      } catch (error) {
        console.error('Failed to get proposals:', error);
        return [];
      }
    }
  
    async getProposal(proposalId: string): Promise<any | null> {
      try {
        const response = await this.request<any>(`/api/v1/proposals/${proposalId}`);
        // Remove user property before returning proposal data
        const { user, message, ...proposalData } = response;
        return proposalData;
      } catch (error) {
        console.error('Failed to get proposal:', error);
        return null;
      }
    }
  
    async getQuestions(): Promise<any[]> {
      try {
        const response = await this.request<QuestionsResponse>('/api/v1/questions');
        return response.questions || [];
      } catch (error) {
        console.error('Failed to get questions:', error);
        return [];
      }
    }
  
    async createQuestion(questionData: any): Promise<boolean> {
      try {
        await this.request<MessageResponse>('/api/v1/questions', {
          method: 'POST',
          body: JSON.stringify(questionData),
        });
        return true;
      } catch (error) {
        console.error('Failed to create question:', error);
        return false;
      }
    }
  
    async checkHealth(): Promise<HealthResponse | null> {
      try {
        const response = await this.request<HealthResponse>('/health');
        return response;
      } catch (error) {
        console.error('Health check failed:', error);
        return null;
      }
    }
  }
  
  // Create API instance
  const apiConfig: ApiConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    timeout: 10000,
  };
  
  export const apiService = new ApiService(apiConfig);
  
  // React hook for API integration
  import { useState, useEffect, useCallback } from 'react';
  
  export interface UseApiReturn {
    user: User | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    apiService: ApiService;
  }
  
  export function useApi(): UseApiReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    const fetchUser = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = await apiService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
        setError(errorMessage);
        console.error('Failed to get user:', err);
      } finally {
        setLoading(false);
      }
    }, []);
  
    useEffect(() => {
      fetchUser();
    }, [fetchUser]);
  
    return {
      user,
      loading,
      error,
      refetch: fetchUser,
      apiService,
    };
  }