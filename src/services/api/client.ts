import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, HTTP_STATUS } from '@/config/api.config';
import { STORAGE_KEYS, ERROR_MESSAGES } from '@/utils/constants';

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
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

// Token management
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
};

const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
  }
};

const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  }
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the response data directly for successful requests
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        // Try to refresh token
        try {
          const refreshResponse = await axios.post(`${API_CONFIG.baseURL}/admin-auth/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });
          
          if (refreshResponse.data?.success && refreshResponse.data?.token) {
            setToken(refreshResponse.data.token);
            originalRequest.headers!.Authorization = `Bearer ${refreshResponse.data.token}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      // If refresh failed or this is a retry, logout user
      removeToken();
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    
    // Transform error response
    const apiError: ApiError = {
      message: ERROR_MESSAGES.GENERIC_ERROR,
      status: error.response?.status,
    };
    
    if (error.response?.data) {
      const errorData = error.response.data as any;
      apiError.message = errorData.message || errorData.error || ERROR_MESSAGES.GENERIC_ERROR;
      apiError.errors = errorData.errors;
      apiError.code = errorData.code;
    } else if (error.code === 'ECONNABORTED') {
      apiError.message = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
    } else if (error.code === 'ERR_NETWORK') {
      apiError.message = ERROR_MESSAGES.NETWORK_ERROR;
    }
    
    return Promise.reject(apiError);
  }
);

// API methods
export class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axiosInstance;
  }
  
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response as T;
  }
  
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response as T;
  }
  
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response as T;
  }
  
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch(url, data, config);
    return response as T;
  }
  
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response as T;
  }
  
  async upload<T = any>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response as T;
  }
  
  // Utility methods
  setAuthToken(token: string): void {
    setToken(token);
  }
  
  removeAuthToken(): void {
    removeToken();
  }
  
  getAuthToken(): string | null {
    return getToken();
  }
  
  isAuthenticated(): boolean {
    return !!getToken();
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();
export default apiClient; 