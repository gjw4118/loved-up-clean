// Deep link handler for question sharing
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseShareLink } from '@/utils/sharing/parseShareLink';

const PENDING_LINK_KEY = '@godeeper/pending_thread_link';

export interface DeepLinkResult {
  threadId: string | null;
  handled: boolean;
}

/**
 * Handle deep link URL
 * Returns thread ID if successfully parsed
 */
export const handleDeepLink = async (
  url: string,
  isAuthenticated: boolean
): Promise<DeepLinkResult> => {
  console.log('🔗 Handling deep link:', url);
  
  const threadId = parseShareLink(url);
  
  if (!threadId) {
    console.log('❌ Could not parse thread ID from URL');
    return { threadId: null, handled: false };
  }
  
  console.log('✅ Parsed thread ID:', threadId);
  
  if (!isAuthenticated) {
    // Save link for after authentication
    console.log('💾 User not authenticated, saving link for later');
    await savePendingLink(threadId);
    
    // Navigate to auth screen
    router.replace('/auth');
    return { threadId, handled: true };
  }
  
  // User is authenticated, navigate to thread
  console.log('🚀 Navigating to thread:', threadId);
  router.push(`/threads/${threadId}`);
  return { threadId, handled: true };
};

/**
 * Save thread ID to handle after authentication
 */
export const savePendingLink = async (threadId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(PENDING_LINK_KEY, threadId);
    console.log('💾 Saved pending thread link:', threadId);
  } catch (error) {
    console.error('Error saving pending link:', error);
  }
};

/**
 * Get and clear pending link after authentication
 */
export const getPendingLink = async (): Promise<string | null> => {
  try {
    const threadId = await AsyncStorage.getItem(PENDING_LINK_KEY);
    if (threadId) {
      await AsyncStorage.removeItem(PENDING_LINK_KEY);
      console.log('📥 Retrieved pending thread link:', threadId);
    }
    return threadId;
  } catch (error) {
    console.error('Error getting pending link:', error);
    return null;
  }
};

/**
 * Handle pending link after authentication
 */
export const handlePendingLink = async (): Promise<boolean> => {
  const threadId = await getPendingLink();
  
  if (threadId) {
    console.log('🔗 Handling pending link:', threadId);
    router.push(`/threads/${threadId}`);
    return true;
  }
  
  return false;
};

/**
 * Set up deep link listeners
 */
export const setupDeepLinkListeners = (
  onLink: (url: string) => void
): (() => void) => {
  // Handle initial URL (app was closed)
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('📱 Initial URL:', url);
      onLink(url);
    }
  });

  // Handle URL when app is in background/foreground
  const subscription = Linking.addEventListener('url', (event) => {
    console.log('📱 Received URL event:', event.url);
    onLink(event.url);
  });

  // Return cleanup function
  return () => {
    subscription.remove();
  };
};

