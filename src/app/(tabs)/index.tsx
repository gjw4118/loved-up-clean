// GoDeeper App - Main Decks Screen (2x2 Grid)
// Clean HeroUI Native implementation with Paywall integration

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusBar } from '@/components/ui';
import { getDeckColor } from '@/constants/Colors';
import { QUESTION_DECKS } from '@/constants/decks';
import { usePaywall } from '@/hooks/usePaywall';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useTheme } from '@/hooks/useTheme';

const { width, height } = Dimensions.get('window');

// Dynamic card sizing based on screen dimensions
const calculateCardDimensions = () => {
  const horizontalPadding = 32; // 16px padding on each side
  const cardSpacing = 16; // Space between cards
  const availableWidth = width - horizontalPadding - cardSpacing;
  const cardWidth = availableWidth / 2;
  
  // Calculate available height for cards
  const headerHeight = 120; // Approximate header height
  const premiumCTAHeight = 100; // Approximate premium CTA height
  const tabBarHeight = 100; // Approximate tab bar height
  const breathingRoom = 40; // Extra breathing room
  const availableHeight = height - headerHeight - premiumCTAHeight - tabBarHeight - breathingRoom;
  
  // Make cards square but ensure they fit
  const cardHeight = Math.min(cardWidth, availableHeight / 2 - 20); // 20px for row spacing
  
  return {
    cardWidth: Math.max(cardWidth, 140), // Minimum width
    cardHeight: Math.max(cardHeight, 140), // Minimum height
    cardSpacing: cardSpacing,
  };
};

// Icon mapping for decks
const DECK_ICONS = {
  friends: 'F',
  family: '🏠',
  dating: '💕',
  growing: '🌱',
  lovers: 'L', 
  work: 'W',
  professional: 'P',
  romantic: 'R',
  spice: 'S',
} as const;

export default function MainDecksScreen() {
  // Use local constants instead of database for now
  const decks = QUESTION_DECKS.map(deck => ({
    id: deck.id,
    name: deck.name,
    description: deck.description,
    category: deck.category,
    icon: deck.icon,
    question_count: deck.estimatedQuestions,
    popularity_score: 0.8,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
  const { theme, isDark } = useTheme();
  const { isPremium } = usePremiumStatus();
  const { isPresenting, presentPaywall } = usePaywall();
  
  // Calculate dynamic card dimensions
  const { cardWidth, cardHeight, cardSpacing } = calculateCardDimensions();

  const handleDeckSelect = async (deckId: string, deckName: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    console.log('Navigating to deck:', { deckId, deckName });
    
    // Navigate to question browsing screen
    router.push({
      pathname: '/questions/[deckId]',
      params: { deckId, deckName }
    });
  };

  // No loading state needed since we're using local constants


  return (
    <SafeAreaView className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient
        colors={isDark ? ['#000000', '#1a1a1a'] : ['#ffffff', '#f8f9fa']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          paddingHorizontal: 16, 
          paddingTop: 24,
          paddingBottom: 40, // Breathing room above tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-8">
          <Text className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Question Decks
          </Text>
          <Text className="text-lg text-gray-600 dark:text-gray-300">
            Choose a deck to start meaningful conversations
          </Text>
        </View>

        {/* Premium CTA - Clean Glass Design */}
        <Pressable 
          className="mb-6 rounded-2xl overflow-hidden"
          onPress={() => presentPaywall('premium_button')}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View 
            className={`rounded-2xl border backdrop-blur-xl ${isDark ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20'}`}
            style={{
              padding: 24,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-2">
                  <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isDark ? 'bg-white/20' : 'bg-black/20'}`}>
                    <Text className="text-2xl">🔥</Text>
                  </View>
                  <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                    Spice Deck
                  </Text>
                </View>
                <Text className={`text-sm leading-5 font-medium ${isDark ? 'text-white/80' : 'text-black/70'}`}>
                  Premium intimate questions for couples to deepen connection
                </Text>
              </View>
              <View 
                className={`rounded-full px-6 py-3 ${isDark ? 'bg-white/20' : 'bg-black/20'}`}
              >
                <Text className={`font-bold text-base ${isDark ? 'text-white' : 'text-black'}`}>
                  Premium
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
        

        {/* Deck Cards - 2x2 Grid */}
        {decks && decks.length > 0 && (
          <View>
            {/* Row 1 */}
            <View 
              className="flex-row justify-between mb-4" 
              style={{ 
                width: '100%',
                gap: cardSpacing,
              }}
            >
              {decks.slice(0, 2).map((deck) => {
                const totalQuestions = deck.question_count || 25;
                const deckColors = getDeckColor(deck.category);
                const deckIcon = DECK_ICONS[deck.category as keyof typeof DECK_ICONS] || '📚';
                
                return (
                  <View key={deck.id} style={{ flex: 1 }}>
                    <Pressable
                      onPress={() => handleDeckSelect(deck.id, deck.name)}
                      style={({ pressed }) => ({
                        width: cardWidth,
                        height: cardHeight,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 12 },
                        shadowOpacity: pressed ? 0.15 : 0.25,
                        shadowRadius: pressed ? 12 : 20,
                        elevation: pressed ? 8 : 15,
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                        opacity: pressed ? 0.9 : 1,
                      })}
                      className="rounded-3xl overflow-hidden"
                    >
                      {/* Clean Glass Background */}
                      <View 
                        className={`absolute inset-0 rounded-3xl backdrop-blur-xl border ${isDark ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20'}`}
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.1,
                          shadowRadius: 12,
                          elevation: 4,
                        }}
                      />
                      
                      {/* Subtle accent border */}
                      <View 
                        className="absolute inset-0 rounded-3xl border"
                        style={{
                          borderColor: isDark 
                            ? `${deckColors.primary}30` 
                            : `${deckColors.primary}20`,
                        }}
                      />

                      <View className="p-6 flex-1 justify-between">
                        <View>
                          <View className="items-center mb-4">
                            <View 
                              className={`w-20 h-20 rounded-full items-center justify-center border ${isDark ? 'bg-white/20 border-white/30' : 'bg-black/20 border-black/30'}`}
                              style={{ 
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4,
                              }}
                            >
                              <Text 
                                className="text-3xl font-bold"
                                style={{ 
                                  color: isDark 
                                    ? '#ffffff' 
                                    : '#000000',
                                }}
                              >
                                {deckIcon}
                              </Text>
                            </View>
                          </View>
                          <Text className={`text-xl font-bold mb-2 leading-6 text-center ${isDark ? 'text-white' : 'text-black'}`}>
                            {deck.name}
                          </Text>
                          <Text className={`text-sm mb-3 leading-4 text-center ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                            {totalQuestions} questions
                          </Text>
                        </View>
                        
                        
                        {/* Enhanced Action Icon */}
                        <View 
                          className={`items-center justify-center rounded-full w-12 h-12 self-center border ${isDark ? 'bg-white/20 border-white/30' : 'bg-black/20 border-black/30'}`}
                          style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                          }}
                        >
                          <Text 
                            className="text-xl"
                            style={{ 
                              color: isDark 
                                ? '#ffffff' 
                                : '#000000',
                              fontWeight: 'bold',
                            }}
                          >
                            →
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
            
            {/* Row 2 */}
            <View 
              className="flex-row justify-between" 
              style={{ 
                width: '100%',
                gap: cardSpacing,
              }}
            >
              {decks.slice(2, 4).map((deck) => {
                const totalQuestions = deck.question_count || 25;
                const deckColors = getDeckColor(deck.category);
                const deckIcon = DECK_ICONS[deck.category as keyof typeof DECK_ICONS] || '📚';
                
                return (
                  <View key={deck.id} style={{ flex: 1 }}>
                    <Pressable
                      onPress={() => handleDeckSelect(deck.id, deck.name)}
                      style={({ pressed }) => ({
                        width: cardWidth,
                        height: cardHeight,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 12 },
                        shadowOpacity: pressed ? 0.15 : 0.25,
                        shadowRadius: pressed ? 12 : 20,
                        elevation: pressed ? 8 : 15,
                        transform: [{ scale: pressed ? 0.95 : 1 }],
                        opacity: pressed ? 0.9 : 1,
                      })}
                      className="rounded-3xl overflow-hidden"
                    >
                      {/* Clean Glass Background */}
                      <View 
                        className={`absolute inset-0 rounded-3xl backdrop-blur-xl border ${isDark ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20'}`}
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.1,
                          shadowRadius: 12,
                          elevation: 4,
                        }}
                      />
                      
                      {/* Subtle accent border */}
                      <View 
                        className="absolute inset-0 rounded-3xl border"
                        style={{
                          borderColor: isDark 
                            ? `${deckColors.primary}30` 
                            : `${deckColors.primary}20`,
                        }}
                      />

                      <View className="p-6 flex-1 justify-between">
                        <View>
                          <View className="items-center mb-4">
                            <View 
                              className={`w-20 h-20 rounded-full items-center justify-center border ${isDark ? 'bg-white/20 border-white/30' : 'bg-black/20 border-black/30'}`}
                              style={{ 
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 8,
                                elevation: 4,
                              }}
                            >
                              <Text 
                                className="text-3xl font-bold"
                                style={{ 
                                  color: isDark 
                                    ? '#ffffff' 
                                    : '#000000',
                                }}
                              >
                                {deckIcon}
                              </Text>
                            </View>
                          </View>
                          <Text className={`text-xl font-bold mb-2 leading-6 text-center ${isDark ? 'text-white' : 'text-black'}`}>
                            {deck.name}
                          </Text>
                          <Text className={`text-sm mb-3 leading-4 text-center ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                            {totalQuestions} questions
                          </Text>
                        </View>
                        
                        
                        {/* Enhanced Action Icon */}
                        <View 
                          className={`items-center justify-center rounded-full w-12 h-12 self-center border ${isDark ? 'bg-white/20 border-white/30' : 'bg-black/20 border-black/30'}`}
                          style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                          }}
                        >
                          <Text 
                            className="text-xl"
                            style={{ 
                              color: isDark 
                                ? '#ffffff' 
                                : '#000000',
                              fontWeight: 'bold',
                            }}
                          >
                            →
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Empty State */}
        {(!decks || decks.length === 0) && (
          <View className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <View className="items-center py-12 px-6">
              <Text className="text-6xl mb-6">📚</Text>
              <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                No decks available
              </Text>
              <Text className="text-center text-gray-600 dark:text-gray-300 leading-6">
                Question decks will appear here once they're loaded
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}