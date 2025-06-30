import { useState, useEffect, useCallback } from 'react';
import { authService, type AdminUser, type LoginCredentials } from '@/services/auth/authService';
import { useToast } from './useToast';

interface UseAuthReturn {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  verify: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Try to get user from stored auth data
        const storedUser = authService.initializeAuth();
        
        if (storedUser) {
          // Verify with server
          const verifyResult = await authService.verify();
          
          if (verifyResult.success && verifyResult.user) {
            setUser(verifyResult.user);
          } else {
            // Verification failed, clear auth data
            await authService.logout();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await authService.login(credentials);
      
      if (result.success && result.user) {
        setUser(result.user);
        showSuccess('Başarıyla giriş yapıldı');
        return true;
      } else {
        showError(result.message || 'Giriş başarısız');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      showError(error.message || 'Giriş sırasında bir hata oluştu');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      showSuccess('Başarıyla çıkış yapıldı');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still clear user state even if logout fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess]);

  // Verify authentication
  const verify = useCallback(async (): Promise<boolean> => {
    try {
      const result = await authService.verify();
      
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Auth verification error:', error);
      setUser(null);
      return false;
    }
  }, []);

  // Check permission
  const hasPermission = useCallback((permission: string): boolean => {
    return authService.hasPermission(permission);
  }, []);

  // Check role
  const hasRole = useCallback((role: string): boolean => {
    return authService.hasRole(role);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    verify,
    hasPermission,
    hasRole,
  };
} 