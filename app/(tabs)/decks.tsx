// Connect App - Question Decks Screen
// Interactive deck selection with real functionality

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { GlassCard, StatusBar } from '@/components/ui';
import { getDeckColor } from '@/constants/Colors';
import { QUESTION_DECKS } from '@/constants/decks';
import { useQuestionDecks } from '@/hooks/questions/useQuestions';

export default function DecksScreen() {
  const { data: decks, isLoading, error } = useQuestionDecks();

  const handleDeckSelect = async (deckId: string, deckName: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Navigate to question browsing screen
    router.push({
      pathname: '/questions/[deckId]',
      params: { deckId, deckName }
    });
  };

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-xl font-bold text-red-400 mb-4">
            Unable to load decks
          </Text>
          <Text className="text-gray-300 text-center">
            Please check your connection and try again
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar style="light" />
      
      <ScrollView className="flex-1 px-4 pt-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-white mb-2">
            Question Decks
          </Text>
          <Text className="text-lg text-gray-300">
            Choose a deck to start meaningful conversations
          </Text>
        </View>
        
        {/* Loading State */}
        {isLoading && (
          <View className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <GlassCard key={i} intensity={20} tint="light" className="h-32">
                <View className="animate-pulse">
                  <View className="h-6 bg-gray-300 rounded mb-2" />
                  <View className="h-4 bg-gray-200 rounded" />
                </View>
              </GlassCard>
            ))}
          </View>
        )}

        {/* Deck Cards */}
        {!isLoading && (
          <View className="space-y-6 pb-8">
            {QUESTION_DECKS.map((deck) => {
              const deckColors = getDeckColor(deck.category);
              
              return (
                <Pressable
                  key={deck.id}
                  onPress={() => handleDeckSelect(deck.id, deck.name)}
                  className="rounded-3xl overflow-hidden shadow-lg"
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  })}
                >
                  {/* Background Gradient */}
                  <LinearGradient
                    colors={deckColors.gradient}
                    className="absolute inset-0"
                  />
                  
                  {/* Content */}
                  <View className="p-6">
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-row items-center">
                        <Text className="text-4xl mr-4">{deck.icon}</Text>
                        <View>
                          <Text className="text-2xl font-bold text-white mb-1">
                            {deck.name}
                          </Text>
                          <Text className="text-white/80 text-sm">
                            ~{deck.estimatedQuestions} questions
                          </Text>
                        </View>
                      </View>
                      
                      <View className="bg-white/20 rounded-full p-3">
                        <Text className="text-white text-2xl">→</Text>
                      </View>
                    </View>
                    
                    <Text className="text-white/90 text-base leading-6 mb-4">
                      {deck.description}
                    </Text>
                    
                    {/* Progress Bar Placeholder */}
                    <View className="bg-white/20 rounded-full h-2">
                      <View 
                        className="bg-white/40 rounded-full h-2"
                        style={{ width: '0%' }} // Will be dynamic based on user progress
                      />
                    </View>
                    <Text className="text-white/60 text-sm mt-2">
                      0% completed
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Empty State */}
        {!isLoading && (!decks || decks.length === 0) && (
          <GlassCard intensity={20} tint="dark">
            <View className="items-center py-8">
              <Text className="text-6xl mb-4">📚</Text>
              <Text className="text-xl font-bold text-white mb-2">
                No decks available
              </Text>
              <Text className="text-gray-300 text-center">
                Question decks will appear here once they're loaded
              </Text>
            </View>
          </GlassCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
