// Connect App - Profile Screen
// Uses HeroUI + iOS 26 glass components

import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { GlassCard, GlassButton } from '@/components/ui';
import { StatusBar } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <StatusBar style="dark" />
      
      <ScrollView className="flex-1 px-4 pt-6">
        <Text className="text-3xl font-bold text-gray-900 mb-6">
          Profile
        </Text>
        
        <View className="space-y-4">
          {/* User Info */}
          <GlassCard intensity={20} tint="light">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              👤 {user?.email || 'User'}
            </Text>
            <Text className="text-gray-600">
              Signed in successfully
            </Text>
          </GlassCard>

          {/* Sign Out Button */}
          <GlassButton
            onPress={handleSignOut}
            variant="secondary"
            size="lg"
            className="mt-6"
          >
            <Text className="text-gray-800 font-semibold">
              Sign Out
            </Text>
          </GlassButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
