// Connect App - Main Router
// Handles authentication flow and routing

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth/AuthContext';
import { StatusBar } from '@/components/ui';

export default function IndexScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to protected area
        router.replace('/(tabs)');
      } else {
        // User is not authenticated, show auth screen
        router.replace('/auth');
      }
    }
  }, [user, loading]);

  // Show loading spinner while checking auth state
  return (
    <View className="flex-1 justify-center items-center bg-orange-500">
      <StatusBar style="light" />
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}
