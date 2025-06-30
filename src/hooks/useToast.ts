import { useCallback } from 'react';
import toast from 'react-hot-toast';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  style?: React.CSSProperties;
  className?: string;
  icon?: string;
  id?: string;
}

interface UseToastReturn {
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showWarning: (message: string, options?: ToastOptions) => void;
  showInfo: (message: string, options?: ToastOptions) => void;
  showLoading: (message: string, options?: ToastOptions) => string;
  dismiss: (toastId?: string) => void;
  dismissAll: () => void;
}

export function useToast(): UseToastReturn {
  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    toast.success(message, {
      duration: options?.duration || 3000,
      position: options?.position || 'top-right',
      style: {
        background: '#10B981',
        color: '#FFFFFF',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon || '✅',
      id: options?.id,
    });
  }, []);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    toast.error(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      style: {
        background: '#EF4444',
        color: '#FFFFFF',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon || '❌',
      id: options?.id,
    });
  }, []);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    toast(message, {
      duration: options?.duration || 3500,
      position: options?.position || 'top-right',
      style: {
        background: '#F59E0B',
        color: '#FFFFFF',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon || '⚠️',
      id: options?.id,
    });
  }, []);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    toast(message, {
      duration: options?.duration || 3000,
      position: options?.position || 'top-right',
      style: {
        background: '#3B82F6',
        color: '#FFFFFF',
        ...options?.style,
      },
      className: options?.className,
      icon: options?.icon || 'ℹ️',
      id: options?.id,
    });
  }, []);

  const showLoading = useCallback((message: string, options?: ToastOptions): string => {
    return toast.loading(message, {
      position: options?.position || 'top-right',
      style: {
        background: '#6B7280',
        color: '#FFFFFF',
        ...options?.style,
      },
      className: options?.className,
      id: options?.id,
    });
  }, []);

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismiss,
    dismissAll,
  };
} 