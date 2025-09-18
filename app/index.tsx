// GoDeeper App - Main Router
// Handles authentication flow and routing

import { StatusBar } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

// Development bypass flag - set to true to skip authentication
const DEV_BYPASS_AUTH = true;

export default function IndexScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('IndexScreen: Auth state changed', { user: !!user, loading, devBypass: DEV_BYPASS_AUTH });
    
    if (!loading) {
      // Development bypass: skip authentication and go directly to tabs
      if (DEV_BYPASS_AUTH) {
        console.log('IndexScreen: DEV BYPASS - Navigating directly to tabs');
        router.replace('/(tabs)');
        return;
      }
      
      if (user) {
        console.log('IndexScreen: User authenticated, navigating to tabs');
        router.replace('/(tabs)');
      } else {
        console.log('IndexScreen: User not authenticated, navigating to auth');
        router.replace('/auth');
      }
    }
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
