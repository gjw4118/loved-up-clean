// Connect App - Favorites Screen
// Uses HeroUI + iOS 26 glass components

import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { GlassCard } from '@/components/ui';
import { StatusBar } from '@/components/ui';

export default function FavoritesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-red-50">
      <StatusBar style="dark" />
      
      <ScrollView className="flex-1 px-4 pt-6">
        <Text className="text-3xl font-bold text-gray-900 mb-6">
          Favorite Questions
        </Text>
        
        <View className="space-y-4">
          {/* Placeholder for favorites */}
          <GlassCard intensity={20} tint="light">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              ❤️ Coming Soon
            </Text>
            <Text className="text-gray-600">
              Your favorite questions will appear here
            </Text>
          </GlassCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
