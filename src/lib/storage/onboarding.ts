import AsyncStorage from '@react-native-async-storage/async-storage';

// Onboarding Storage Helper
// Tracks whether user has seen the welcome screen

const ONBOARDING_KEY = '@lovedup_has_seen_onboarding';

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error reading onboarding status:', error);
    return false;
  }
}

export async function setOnboardingSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Error setting onboarding status:', error);
  }
}

export async function clearOnboardingStatus(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    console.log('✅ Onboarding status cleared - welcome screen will show on next launch');
  } catch (error) {
    console.error('Error clearing onboarding status:', error);
  }
}

// Debug helper to check current onboarding status
export async function debugOnboardingStatus(): Promise<void> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    console.log('🔍 Debug - Onboarding status:', {
      key: ONBOARDING_KEY,
      value,
      hasSeen: value === 'true',
      willShowWelcome: value !== 'true'
    });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
  }
}

