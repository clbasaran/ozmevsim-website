import { apiClient, type ApiResponse } from '../api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import { COOKIE_NAMES } from '@/utils/constants';

// Types
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  name?: string;
  role: string;
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AdminUser;
  message?: string;
}

export interface VerifyResponse {
  success: boolean;
  user?: AdminUser;
  message?: string;
}

// Cookie management utilities
const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
};

const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

class AuthService {
  /**
   * Login admin user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.ADMIN_LOGIN, credentials);
      
      if (response.success && response.token) {
        // Store token in API client
        apiClient.setAuthToken(response.token);
        
        // Store auth info in cookie for SSR
        setCookie(COOKIE_NAMES.ADMIN_AUTH, JSON.stringify({
          token: response.token,
          user: response.user,
          timestamp: Date.now(),
        }), credentials.rememberMe ? 30 : 1);
        
        return response;
      }
      
      return response || { success: false, message: 'Giriş başarısız' };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Giriş sırasında bir hata oluştu',
      };
    }
  }
  
  /**
   * Logout admin user
   */
  async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.post(API_ENDPOINTS.ADMIN_LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with client-side logout even if API call fails
    }
    
    // Clear client-side auth data
    apiClient.removeAuthToken();
    deleteCookie(COOKIE_NAMES.ADMIN_AUTH);
    
    // Redirect to login page if on admin route
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login';
    }
    
    return { success: true, message: 'Başarıyla çıkış yapıldı' };
  }
  
  /**
   * Verify current authentication status
   */
  async verify(): Promise<VerifyResponse> {
    try {
      const response = await apiClient.get<VerifyResponse>(API_ENDPOINTS.ADMIN_VERIFY);
      return response || { success: false };
    } catch (error: any) {
      console.error('Auth verification error:', error);
      
      // If verification fails, clear auth data
      this.clearAuthData();
      
      return {
        success: false,
        message: error.message || 'Kimlik doğrulama başarısız',
      };
    }
  }
  
  /**
   * Refresh authentication token
   */
  async refresh(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.ADMIN_REFRESH);
      
      if (response.success && response.token) {
        // Update token in API client
        apiClient.setAuthToken(response.token);
        
        // Update cookie
        const existingAuth = this.getStoredAuth();
        if (existingAuth) {
          setCookie(COOKIE_NAMES.ADMIN_AUTH, JSON.stringify({
            ...existingAuth,
            token: response.token,
            timestamp: Date.now(),
          }));
        }
        
        return response;
      }
      
      return response || { success: false, message: 'Token yenileme başarısız' };
    } catch (error: any) {
      console.error('Token refresh error:', error);
      this.clearAuthData();
      
      return {
        success: false,
        message: error.message || 'Token yenileme sırasında bir hata oluştu',
      };
    }
  }
  
  /**
   * Get stored authentication data
   */
  getStoredAuth(): { token: string; user: AdminUser; timestamp: number } | null {
    try {
      const authCookie = getCookie(COOKIE_NAMES.ADMIN_AUTH);
      if (!authCookie) return null;
      
      const authData = JSON.parse(authCookie);
      
      // Check if token is expired (24 hours)
      const isExpired = Date.now() - authData.timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) {
        this.clearAuthData();
        return null;
      }
      
      return authData;
    } catch (error) {
      console.error('Error parsing stored auth data:', error);
      this.clearAuthData();
      return null;
    }
  }
  
  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    const storedAuth = this.getStoredAuth();
    return !!storedAuth?.token && apiClient.isAuthenticated();
  }
  
  /**
   * Get current authenticated user
   */
  getCurrentUser(): AdminUser | null {
    const storedAuth = this.getStoredAuth();
    return storedAuth?.user || null;
  }
  
  /**
   * Clear all authentication data
   */
  private clearAuthData(): void {
    apiClient.removeAuthToken();
    deleteCookie(COOKIE_NAMES.ADMIN_AUTH);
  }
  
  /**
   * Initialize auth state from stored data
   */
  initializeAuth(): AdminUser | null {
    const storedAuth = this.getStoredAuth();
    
    if (storedAuth?.token) {
      apiClient.setAuthToken(storedAuth.token);
      return storedAuth.user;
    }
    
    return null;
  }
  
  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  }
  
  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService; 