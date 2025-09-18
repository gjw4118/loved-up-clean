// Connect App - Favorites Screen
// Beautiful glass design with saved questions and interactions

import { GlassButton, GlassCard, LinearGradient, StatusBar } from '@/components/ui';
import { useColorScheme } from '@/components/useColorScheme';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  
  // Force theme detection - if colorScheme is null/undefined, default to 'light'
  const theme = colorScheme || 'light';
  const isDark = theme === 'dark';
  
  // Mock data for demonstration - will be replaced with real data
  const favoriteQuestions = [
    {
      id: '1',
      text: 'What\'s the most spontaneous thing you\'ve ever done?',
      deck: 'Friends & Social',
      category: 'friends',
      addedDate: '2024-01-15'
    },
    {
      id: '2', 
      text: 'If you could have dinner with anyone, living or dead, who would it be?',
      deck: 'Family & Relationships',
      category: 'family',
      addedDate: '2024-01-14'
    },
    {
      id: '3',
      text: 'What\'s a skill you\'ve always wanted to learn?',
      deck: 'Professional & Growth',
      category: 'professional',
      addedDate: '2024-01-13'
    }
  ];

  const handleQuestionPress = async (questionId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to question detail or start a session
    console.log('Opening question:', questionId);
  };

  const handleRemoveFavorite = async (questionId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Remove from favorites
    console.log('Removing favorite:', questionId);
  };

  const handleBrowseDecks = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/decks');
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Theme-aware Dynamic Gradient Background */}
      <LinearGradient
        colors={isDark 
          ? ['#1a1a2e', '#16213e', '#0f3460'] 
          : ['#f8fafc', '#e2e8f0', '#cbd5e1']
        }
        className="absolute inset-0"
      />
      
      {/* Subtle Glass Overlay */}
      <View className={`absolute inset-0 ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
      
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Header with Glass Effect */}
        <GlassCard 
          intensity={30} 
          tint="dark" 
          className="mb-6 p-6"
          radius="2xl"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-white mb-1">
                Favorites
              </Text>
              <Text className="text-white/70">
                {favoriteQuestions.length} saved questions
              </Text>
            </View>
            <View className="bg-red-500/20 rounded-full p-3">
              <Text className="text-2xl">💖</Text>
            </View>
          </View>
        </GlassCard>

        {/* Favorites List */}
        {favoriteQuestions.length > 0 ? (
          <View className="space-y-4 mb-8">
            {favoriteQuestions.map((question, index) => (
              <GlassCard 
                key={question.id}
                intensity={25} 
                tint="dark" 
                className="p-5"
                radius="xl"
                isInteractive={true}
              >
                <Pressable 
                  onPress={() => handleQuestionPress(question.id)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  })}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-white font-medium text-base leading-6 mb-2">
                        {question.text}
                      </Text>
                      <View className="flex-row items-center">
                        <View className="bg-orange-500/20 rounded-full px-2 py-1 mr-2">
                          <Text className="text-orange-400 text-xs font-medium">
                            {question.deck}
                          </Text>
                        </View>
                        <Text className="text-white/50 text-xs">
                          {question.addedDate}
                        </Text>
                      </View>
                    </View>
                    
                    <Pressable 
                      onPress={() => handleRemoveFavorite(question.id)}
                      className="ml-3 p-2"
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Text className="text-red-400 text-lg">💔</Text>
                    </Pressable>
                  </View>
                  
                  <View className="flex-row items-center justify-between">
                    <Text className="text-orange-400 text-sm font-medium">
                      Tap to start conversation
                    </Text>
                    <Text className="text-white/40">→</Text>
                  </View>
                </Pressable>
              </GlassCard>
            ))}
          </View>
        ) : (
          /* Empty State */
          <GlassCard 
            intensity={25} 
            tint="dark" 
            className="p-8 mb-8"
            radius="2xl"
          >
            <View className="items-center">
              <Text className="text-6xl mb-4">💔</Text>
              <Text className="text-xl font-bold text-white mb-3">
                No Favorites Yet
              </Text>
              <Text className="text-white/70 text-center mb-6 leading-6">
                Start browsing questions and tap the heart icon to save your favorites for easy access
              </Text>
              
              <GlassButton
                onPress={handleBrowseDecks}
                variant="primary"
                size="lg"
                className="w-full"
              >
                <Text className="text-white font-semibold">
                  Browse Questions
                </Text>
              </GlassButton>
            </View>
          </GlassCard>
        )}

        {/* Quick Actions */}
        <View className="gap-3 mb-8">
          <GlassButton
            onPress={handleBrowseDecks}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            <Text className="text-white font-medium">
              Discover More Questions
            </Text>
          </GlassButton>
        </View>

        {/* Bottom spacing for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
