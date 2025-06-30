import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api/client';
import { useToast } from './useToast';

interface SiteSetting {
  key: string;
  value: any;
  type: string;
  category: string;
  group_name: string;
  description?: string;
  is_public: boolean;
  sort_order: number;
}

interface UseSettingsOptions {
  group?: string;
  category?: string;
  publicOnly?: boolean;
  autoFetch?: boolean;
}

interface UseSettingsReturn {
  settings: Record<string, Record<string, any>>;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSetting: (key: string, value: any) => Promise<boolean>;
  updateSettings: (settings: Array<{key: string; value: any}>) => Promise<boolean>;
  getSetting: (key: string, defaultValue?: any) => any;
  getGroupSettings: (group: string) => Record<string, any>;
  refresh: () => Promise<void>;
}

export function useSettings(options: UseSettingsOptions = {}): UseSettingsReturn {
  const {
    group,
    category,
    publicOnly = false,
    autoFetch = true
  } = options;

  const [settings, setSettings] = useState<Record<string, Record<string, any>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (group) params.append('group', group);
      if (category) params.append('category', category);
      if (publicOnly) params.append('public', 'true');

      const response = await apiClient.get(`/api/settings?${params.toString()}`);

      if (response.success) {
        setSettings(response.data || {});
      } else {
        throw new Error(response.error || 'Failed to fetch settings');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch settings';
      setError(errorMessage);
      console.error('Settings fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [group, category, publicOnly]);

  const updateSetting = useCallback(async (key: string, value: any): Promise<boolean> => {
    try {
      const response = await apiClient.put('/api/settings', {
        key,
        value
      });

      if (response.success) {
        // Update local state
        setSettings(prev => {
          const newSettings = { ...prev };
          
          // Find which group this setting belongs to
          for (const [groupName, groupSettings] of Object.entries(newSettings)) {
            if (groupSettings[key]) {
              newSettings[groupName] = {
                ...groupSettings,
                [key]: {
                  ...groupSettings[key],
                  value
                }
              };
              break;
            }
          }
          
          return newSettings;
        });

        showSuccess('Ayar başarıyla güncellendi');
        return true;
      } else {
        throw new Error(response.error || 'Failed to update setting');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Ayar güncellenirken hata oluştu';
      showError(errorMessage);
      console.error('Setting update error:', err);
      return false;
    }
  }, [showSuccess, showError]);

  const updateSettings = useCallback(async (settingsToUpdate: Array<{key: string; value: any}>): Promise<boolean> => {
    try {
      const response = await apiClient.put('/api/settings', {
        settings: settingsToUpdate
      });

      if (response.success) {
        // Update local state for all changed settings
        setSettings(prev => {
          const newSettings = { ...prev };
          
          settingsToUpdate.forEach(({ key, value }) => {
            for (const [groupName, groupSettings] of Object.entries(newSettings)) {
              if (groupSettings[key]) {
                newSettings[groupName] = {
                  ...groupSettings,
                  [key]: {
                    ...groupSettings[key],
                    value
                  }
                };
                break;
              }
            }
          });
          
          return newSettings;
        });

        showSuccess(`${settingsToUpdate.length} ayar başarıyla güncellendi`);
        return true;
      } else {
        throw new Error(response.error || 'Failed to update settings');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Ayarlar güncellenirken hata oluştu';
      showError(errorMessage);
      console.error('Settings update error:', err);
      return false;
    }
  }, [showSuccess, showError]);

  const getSetting = useCallback((key: string, defaultValue: any = null): any => {
    for (const groupSettings of Object.values(settings)) {
      if (groupSettings[key]) {
        return groupSettings[key].value;
      }
    }
    return defaultValue;
  }, [settings]);

  const getGroupSettings = useCallback((groupName: string): Record<string, any> => {
    const groupSettings = settings[groupName] || {};
    const result: Record<string, any> = {};
    
    Object.entries(groupSettings).forEach(([key, setting]) => {
      result[key] = setting.value;
    });
    
    return result;
  }, [settings]);

  const refresh = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchSettings();
    }
  }, [fetchSettings, autoFetch]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSetting,
    updateSettings,
    getSetting,
    getGroupSettings,
    refresh
  };
}

// Specialized hooks for common use cases
export function usePublicSettings() {
  return useSettings({ publicOnly: true });
}

export function useCompanySettings() {
  return useSettings({ group: 'company_info' });
}

export function useContactSettings() {
  return useSettings({ group: 'contact_info' });
}

export function useSocialSettings() {
  return useSettings({ group: 'social_media' });
}

export function useSEOSettings() {
  return useSettings({ group: 'seo_settings' });
}

export function useSystemSettings() {
  return useSettings({ group: 'system_settings' });
} 