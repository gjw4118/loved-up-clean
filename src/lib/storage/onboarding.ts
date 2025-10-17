import AsyncStorage from '@react-native-async-storage/async-storage';

// Onboarding Storage Helper
// Tracks whether user has seen the welcome screen

const ONBOARDING_KEY = '@lovedup_has_seen_onboarding';

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    console.log('Onboarding storage check:', { key: ONBOARDING_KEY, value, result: value === 'true' });
    return value === 'true';
  } catch (error) {
    console.error('Error reading onboarding status:', error);
    return false;
  }
}

export async function setOnboardingSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    console.log('Onboarding status set to seen:', { key: ONBOARDING_KEY });
  } catch (error) {
    console.error('Error setting onboarding status:', error);
  }
}

export async function clearOnboardingStatus(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
    console.log('Onboarding status cleared for testing');
  } catch (error) {
    console.error('Error clearing onboarding status:', error);
  }
}

// Development helper to reset onboarding
export async function resetOnboardingForTesting(): Promise<void> {
  console.log('🧪 Resetting onboarding for testing...');
  await clearOnboardingStatus();
}

