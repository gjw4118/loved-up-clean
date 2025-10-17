// Debug Utilities for Onboarding/Welcome Screen
// Use these to test the welcome screen flow

import { clearOnboardingStatus, debugOnboardingStatus } from '@/lib/storage/onboarding';

// Clear onboarding status to force welcome screen to show
export const resetWelcomeScreen = async () => {
  console.log('🔄 Resetting welcome screen...');
  await clearOnboardingStatus();
  console.log('✅ Welcome screen will show on next app launch');
};

// Check current onboarding status
export const checkWelcomeScreenStatus = async () => {
  console.log('🔍 Checking welcome screen status...');
  await debugOnboardingStatus();
};

// Force show welcome screen (for testing)
export const forceShowWelcomeScreen = async () => {
  console.log('🚀 Forcing welcome screen to show...');
  await clearOnboardingStatus();
  console.log('✅ Restart the app to see the welcome screen');
};
