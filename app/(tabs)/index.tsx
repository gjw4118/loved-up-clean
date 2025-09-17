// Connect App - Home Screen
// Uses HeroUI + iOS 26 glass components

import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from '@/components/ui';
import { GlassCard } from '@/components/ui';
import { StatusBar } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';

export default function HomeScreen() {
  const { user, profile } = useAuth();

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      
      {/* iOS 26 Gradient Background */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        className="absolute inset-0"
      />
      
      <ScrollView className="flex-1 px-4 pt-6">
        {/* Welcome Header */}
        <View className="items-center mb-8">
          <Text className="text-6xl mb-4">💬</Text>
          <Text className="text-4xl font-bold text-white mb-2">
            Welcome to Connect
          </Text>
          <Text className="text-lg text-white/90 text-center">
            {profile?.display_name || user?.email || 'Ready to connect?'}
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="space-y-4 mb-8">
          <GlassCard intensity={25} tint="light">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-2xl font-bold text-gray-800">0</Text>
                <Text className="text-gray-600">Questions Completed</Text>
              </View>
              <Text className="text-3xl">🎯</Text>
            </View>
          </GlassCard>

          <GlassCard intensity={25} tint="light">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-2xl font-bold text-gray-800">4</Text>
                <Text className="text-gray-600">Available Decks</Text>
              </View>
              <Text className="text-3xl">📚</Text>
            </View>
          </GlassCard>
        </View>

        {/* Featured Deck Preview */}
        <GlassCard intensity={25} tint="light" className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            🌟 Featured Today
          </Text>
          <Text className="text-lg font-semibold text-gray-700 mb-2">
            Friends & Social
          </Text>
          <Text className="text-gray-600 leading-6">
            Questions to deepen friendships and create memorable moments with your social circle
          </Text>
        </GlassCard>

        {/* Bottom spacing for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
