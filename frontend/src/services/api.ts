import { API_BASE_URL, API_TIMEOUT, HTTP_STATUS, STORAGE_KEYS } from '@/config/constants';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Request Options
interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  timeout?: number;
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  // Get auth token from storage
  private getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // Set auth token in storage
  public setAuthToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  // Remove auth token from storage
  public removeAuthToken(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Build headers
  private buildHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);
    
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const token = this.getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Build URL with query parameters
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    // Handle relative URLs by using window.location.origin as base
    const baseUrl = this.baseURL.startsWith('http') 
      ? this.baseURL 
      : `${window.location.origin}${this.baseURL}`;
    
    const url = new URL(`${baseUrl}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  // Handle response
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || 'An error occurred',
        status: response.status,
        errors: data.errors,
      };

      // Handle unauthorized errors
      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        this.removeAuthToken();
        window.location.href = '/login';
      }

      throw error;
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  }

  // Make request with timeout
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, timeout = this.timeout, ...fetchOptions } = options;
    
    const url = this.buildURL(endpoint, params);
    const headers = this.buildHeaders(options.headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          status: 408,
        } as ApiError;
      }

      if (error.message && error.status) {
        throw error as ApiError;
      }

      throw {
        message: error.message || 'Network error',
        status: 0,
      } as ApiError;
    }
  }

  // HTTP Methods
  public async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'GET',
      params,
    });
  }

  public async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  public async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  public async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Upload file
  public async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const headers = new Headers();
    const token = this.getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  // Download file
  public async downloadFile(endpoint: string, filename: string): Promise<void> {
    const token = this.getAuthToken();
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, { headers });
    
    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

// Export singleton instance
export const api = new ApiService();

// Export convenience functions
export default api;
