// Push Notification Token Registration
// Simple setup: registers and stores push tokens, no actual sending yet

import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/database/supabase';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Safely import notifications
let Notifications: any = null;
let isAvailable = false;

try {
  Notifications = require('expo-notifications');
  // Check if the native module is actually available
  isAvailable = Notifications && typeof Notifications.getPermissionsAsync === 'function';
} catch (error) {
  console.warn('expo-notifications not available:', error);
  isAvailable = false;
}

// Check if notifications are available
const isNotificationsAvailable = () => {
  return isAvailable;
};

// Configure notification handler (for when we do send notifications later)
if (isNotificationsAvailable()) {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowAlert: true,
      }),
    });
  } catch (error) {
    console.warn('Failed to set notification handler:', error);
  }
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Check if notifications are available
  if (!isNotificationsAvailable()) {
    console.log('⚠️ Push notifications not available');
    return null;
  }

  // Only work on physical devices
  if (!Device.isDevice) {
    console.log('⚠️ Push notifications require a physical device');
    return null;
  }

  try {
    // Check existing permissions
    const { status: existingStatus, canAskAgain } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      if (!canAskAgain) {
        console.log('❌ Push notification permissions blocked - user must enable in device settings');
        throw new Error('Permissions blocked. Please enable notifications in your device settings.');
      }
      
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: true,
          allowCriticalAlerts: false,
          provideAppNotificationSettings: true,
          allowProvisional: false,
        },
      });
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('❌ Push notification permissions denied:', finalStatus);
      throw new Error(`Permissions denied. Status: ${finalStatus}`);
    }

    // Set up Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    // Get Expo push token
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    
    console.log('✅ Push token generated:', token.substring(0, 30) + '...');
    return token;
    
  } catch (error) {
    console.error('❌ Error registering for push notifications:', error);
    throw error; // Re-throw to allow proper error handling in the calling function
  }
}

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Early return if notifications not available
  if (!isNotificationsAvailable()) {
    return {
      expoPushToken: null,
      isEnabled: false,
      isLoading: false,
      enablePushNotifications: async () => {
        console.warn('Push notifications not available in this environment');
        return false;
      },
      disablePushNotifications: async () => {
        console.warn('Push notifications not available in this environment');
        return false;
      },
      togglePushNotifications: async () => {
        console.warn('Push notifications not available in this environment');
        return false;
      },
      openSettings: async () => {
        console.warn('Settings not available in this environment');
      },
    };
  }

  // Save token to Supabase
  const saveTokenToSupabase = async (token: string) => {
    if (!user?.id || !token) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          expo_push_token: token,
          push_token_updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ Error saving push token:', error);
      } else {
        console.log('✅ Push token saved to Supabase');
      }
    } catch (error) {
      console.error('❌ Exception saving push token:', error);
    }
  };

  // Load settings from Supabase
  const loadSettings = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('expo_push_token, push_notifications_enabled')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error loading notification settings:', error);
        return;
      }
      
      if (data) {
        setIsEnabled(data.push_notifications_enabled || false);
        if (data.expo_push_token) {
          setExpoPushToken(data.expo_push_token);
          console.log('✅ Existing push token loaded');
        }
      }
    } catch (error) {
      console.error('Exception loading notification settings:', error);
    }
  };

  // Enable push notifications
  const enablePushNotifications = async () => {
    if (!user?.id) return false;

    setIsLoading(true);
    try {
      // Register for push notifications and get token
      const token = await registerForPushNotificationsAsync();
      
      if (!token) {
        console.log('❌ Failed to get push token');
        return false;
      }

      // Save to state
      setExpoPushToken(token);
      setIsEnabled(true);

      // Save to Supabase
      await saveTokenToSupabase(token);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ push_notifications_enabled: true })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ Error enabling push notifications:', error);
        return false;
      }

      console.log('✅ Push notifications enabled');
      return true;
      
    } catch (error) {
      console.error('❌ Error enabling push notifications:', error);
      // Re-throw the error so the UI can handle it properly
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Disable push notifications
  const disablePushNotifications = async () => {
    if (!user?.id) return false;

    setIsLoading(true);
    try {
      setIsEnabled(false);

      const { error } = await supabase
        .from('user_profiles')
        .update({ push_notifications_enabled: false })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ Error disabling push notifications:', error);
        return false;
      }

      console.log('✅ Push notifications disabled');
      return true;
      
    } catch (error) {
      console.error('❌ Error disabling push notifications:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle push notifications
  const togglePushNotifications = async () => {
    try {
      if (isEnabled) {
        return await disablePushNotifications();
      } else {
        return await enablePushNotifications();
      }
    } catch (error) {
      console.error('❌ Error toggling push notifications:', error);
      // Re-throw the error so the UI can handle it properly
      throw error;
    }
  };

  // Initialize - load settings but don't register automatically
  useEffect(() => {
    if (user?.id) {
      console.log('📱 Initializing push notifications for user:', user.id);
      loadSettings();
    }
  }, [user?.id]);

  // Open device settings
  const openSettings = async () => {
    try {
      const { openSettings } = await import('expo-linking');
      await openSettings();
    } catch (error) {
      console.error('❌ Error opening settings:', error);
    }
  };

  return {
    expoPushToken,
    isEnabled,
    isLoading,
    enablePushNotifications,
    disablePushNotifications,
    togglePushNotifications,
    openSettings,
  };
};

