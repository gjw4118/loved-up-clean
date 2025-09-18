// GoDeeper App - Main Router
// Handles authentication flow and routing

import { StatusBar } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function IndexScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('IndexScreen: Auth state changed', { user: !!user, loading });
    
    if (!loading) {
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
      <Text className="text-white mt-4">Loading...</Text>
    </View>
  );
}
