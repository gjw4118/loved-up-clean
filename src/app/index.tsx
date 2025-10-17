// GoDeeper App - Main Router
// Handles onboarding and authentication flow

import { StatusBar } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

// Development bypass flag - set to true to skip authentication
const DEV_BYPASS_AUTH = false;

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboardingAndRoute = async () => {
      if (!loading) {
        const { hasSeenOnboarding } = await import('@/lib/storage/onboarding');
        const seenOnboarding = await hasSeenOnboarding();
        setCheckingOnboarding(false);

        if (!seenOnboarding) {
          router.replace('/welcome');
          return;
        }

        // Development bypass: skip authentication and go directly to tabs
        if (DEV_BYPASS_AUTH) {
          router.replace('/(tabs)');
          return;
        }

        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth');
        }
      }
    };

    checkOnboardingAndRoute();
  }, [user, loading]);

  // Show loading spinner while checking auth state
  return (
    <View className="flex-1 justify-center items-center bg-orange-500">
      <StatusBar style="light" />
      <ActivityIndicator size="large" color="white" />
      <Text className="text-white mt-4">
        {DEV_BYPASS_AUTH ? 'Dev Mode - Loading...' : 'Loading...'}
      </Text>
    </View>
  );
}
