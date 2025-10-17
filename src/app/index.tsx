// GoDeeper App - Main Router
// Handles onboarding and authentication flow

import { StatusBar } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

// Development bypass flag - set to true to skip authentication
const DEV_BYPASS_AUTH = process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true';

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    const checkOnboardingAndRoute = async () => {
      console.log('🚀 IndexScreen: Checking onboarding and route...', { loading, hasNavigated, user: user?.id });
      
      if (!loading && !hasNavigated) {
        const { hasSeenOnboarding } = await import('@/lib/storage/onboarding');
        const seenOnboarding = await hasSeenOnboarding();
        console.log('📋 IndexScreen: Onboarding status:', seenOnboarding);
        
        setCheckingOnboarding(false);
        setHasNavigated(true);

        if (!seenOnboarding) {
          console.log('👋 IndexScreen: Navigating to welcome screen');
          router.replace('/welcome');
          return;
        }

        // Development bypass: skip authentication and go directly to tabs
        if (DEV_BYPASS_AUTH) {
          console.log('🔧 IndexScreen: DEV_BYPASS_AUTH - Navigating to tabs');
          router.replace('/(tabs)');
          return;
        }

        if (user) {
          console.log('✅ IndexScreen: User authenticated, navigating to tabs');
          router.replace('/(tabs)');
        } else {
          console.log('🔐 IndexScreen: No user, navigating to auth');
          router.replace('/auth');
        }
      } else {
        console.log('⏳ IndexScreen: Skipping navigation - loading:', loading, 'hasNavigated:', hasNavigated);
      }
    };

    checkOnboardingAndRoute();
  }, [user, loading, hasNavigated]);

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
