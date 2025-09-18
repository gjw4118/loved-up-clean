// GoDeeper App - Main Decks Screen (2x2 Grid)
// Clean HeroUI Native implementation with Paywall integration

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { StatusBar } from '@/components/ui';
import { getDeckColor } from '@/constants/Colors';
import { HARDCODED_DECKS } from '@/constants/hardcodedQuestions';
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
  lovers: 'L', 
  family: 'F',
  work: 'W',
  professional: 'P',
  romantic: 'R',
  spice: 'S',
} as const;

export default function MainDecksScreen() {
  const decks = HARDCODED_DECKS;
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


  return (
    <SafeAreaView className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient
        colors={isDark ? ['#1a1a1a', '#2d2d2d'] : ['#f8fafc', '#e2e8f0', '#cbd5e1']}
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
        
        {/* Premium CTA - Enhanced */}
        <Pressable 
          className="mb-6 rounded-xl"
          onPress={() => presentPaywall('premium_button')}
          style={{
            shadowColor: '#FFD700',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={isDark ? ['#FFD700', '#FFA500', '#FF8C00'] : ['#FFD700', '#FFA500', '#FF8C00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 12,
              padding: 20,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 bg-white/30 rounded-full items-center justify-center mr-3">
                    <Text className="text-lg font-bold text-white">★</Text>
                  </View>
                  <Text className="text-xl font-bold text-white">
                    Unlock Premium
                  </Text>
                </View>
                <Text className="text-white/90 text-sm leading-5 font-medium">
                  Get Spice deck + unlimited questions
                </Text>
              </View>
              <View 
                className="bg-white/20 rounded-full px-6 py-3"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text className="text-white font-bold text-base">
                  Upgrade
                </Text>
              </View>
            </View>
          </LinearGradient>
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
                const isSpiceDeck = deck.category === 'spice';
                const freeQuestions = isSpiceDeck ? 0 : 5;
                const totalQuestions = deck.question_count || (isSpiceDeck ? 50 : 25);
                const userHasPremium = isPremium;
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
                      {/* Enhanced Colored Background with Gradient */}
                      <LinearGradient
                        colors={isDark 
                          ? [`${deckColors.primary}30`, `${deckColors.secondary}20`]
                          : [`${deckColors.primary}25`, `${deckColors.secondary}15`]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: 24,
                        }}
                      />
                      
                      {/* Enhanced overlay for readability */}
                      <View 
                        className="absolute inset-0 rounded-3xl"
                        style={{
                          backgroundColor: isDark 
                            ? 'rgba(255, 255, 255, 0.08)' 
                            : 'rgba(255, 255, 255, 0.4)',
                        }}
                      />
                      
                      {/* Enhanced accent border with glow effect */}
                      <View 
                        className="absolute inset-0 rounded-3xl border-2"
                        style={{
                          borderColor: isDark 
                            ? `${deckColors.primary}70` 
                            : `${deckColors.primary}50`,
                          shadowColor: deckColors.primary,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 8,
                        }}
                      />

                      <View className="p-6 flex-1 justify-between">
                        <View>
                          <View className="items-center mb-4">
                            <View 
                              className="w-20 h-20 rounded-full items-center justify-center"
                              style={{ 
                                backgroundColor: isDark 
                                  ? `${deckColors.primary}50` 
                                  : `${deckColors.primary}30`,
                                shadowColor: deckColors.primary,
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.4,
                                shadowRadius: 12,
                                elevation: 8,
                                borderWidth: 2,
                                borderColor: isDark 
                                  ? `${deckColors.primary}60` 
                                  : `${deckColors.primary}40`,
                              }}
                            >
                              <Text 
                                className="text-3xl font-bold"
                                style={{ 
                                  color: isDark 
                                    ? '#ffffff' 
                                    : deckColors.primary,
                                  textShadowColor: isDark 
                                    ? 'rgba(0, 0, 0, 0.4)' 
                                    : 'rgba(255, 255, 255, 0.9)',
                                  textShadowOffset: { width: 0, height: 2 },
                                  textShadowRadius: 4,
                                }}
                              >
                                {deckIcon}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-xl font-bold text-gray-900 mb-2 leading-6 text-center">
                            {deck.name}
                          </Text>
                          <Text className="text-gray-700 text-sm mb-3 leading-4 text-center">
                            {isSpiceDeck 
                              ? 'Premium Only' 
                              : userHasPremium 
                                ? `${totalQuestions} questions` 
                                : `${freeQuestions}/${totalQuestions} free`
                            }
                          </Text>
                        </View>
                        
                        {/* Premium Badge */}
                        {isSpiceDeck && (
                          <View className="mb-3 self-center bg-yellow-500 rounded-full px-4 py-2">
                            <Text className="text-black text-xs font-bold">PREMIUM</Text>
                          </View>
                        )}
                        
                        {/* Enhanced Action Icon */}
                        <View 
                          className="items-center justify-center rounded-full w-12 h-12 self-center"
                          style={{
                            backgroundColor: isDark 
                              ? 'rgba(255, 255, 255, 0.25)' 
                              : 'rgba(255, 255, 255, 0.9)',
                            shadowColor: deckColors.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 4,
                            borderWidth: 1,
                            borderColor: isDark 
                              ? `${deckColors.primary}30` 
                              : `${deckColors.primary}20`,
                          }}
                        >
                          {isSpiceDeck && !userHasPremium ? (
                            <Text className="text-lg font-bold text-gray-500 dark:text-gray-300">LOCK</Text>
                          ) : (
                            <Text 
                              className="text-xl"
                              style={{ 
                                color: isDark 
                                  ? deckColors.primary 
                                  : deckColors.primary,
                                fontWeight: 'bold',
                              }}
                            >
                              →
                            </Text>
                          )}
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
                const isSpiceDeck = deck.category === 'spice';
                const freeQuestions = isSpiceDeck ? 0 : 5;
                const totalQuestions = deck.question_count || (isSpiceDeck ? 50 : 25);
                const userHasPremium = isPremium;
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
                      {/* Enhanced Colored Background with Gradient */}
                      <LinearGradient
                        colors={isDark 
                          ? [`${deckColors.primary}30`, `${deckColors.secondary}20`]
                          : [`${deckColors.primary}25`, `${deckColors.secondary}15`]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: 24,
                        }}
                      />
                      
                      {/* Enhanced overlay for readability */}
                      <View 
                        className="absolute inset-0 rounded-3xl"
                        style={{
                          backgroundColor: isDark 
                            ? 'rgba(255, 255, 255, 0.08)' 
                            : 'rgba(255, 255, 255, 0.4)',
                        }}
                      />
                      
                      {/* Enhanced accent border with glow effect */}
                      <View 
                        className="absolute inset-0 rounded-3xl border-2"
                        style={{
                          borderColor: isDark 
                            ? `${deckColors.primary}70` 
                            : `${deckColors.primary}50`,
                          shadowColor: deckColors.primary,
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.3,
                          shadowRadius: 8,
                          elevation: 8,
                        }}
                      />

                      <View className="p-6 flex-1 justify-between">
                        <View>
                          <View className="items-center mb-4">
                            <View 
                              className="w-20 h-20 rounded-full items-center justify-center"
                              style={{ 
                                backgroundColor: isDark 
                                  ? `${deckColors.primary}50` 
                                  : `${deckColors.primary}30`,
                                shadowColor: deckColors.primary,
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.4,
                                shadowRadius: 12,
                                elevation: 8,
                                borderWidth: 2,
                                borderColor: isDark 
                                  ? `${deckColors.primary}60` 
                                  : `${deckColors.primary}40`,
                              }}
                            >
                              <Text 
                                className="text-3xl font-bold"
                                style={{ 
                                  color: isDark 
                                    ? '#ffffff' 
                                    : deckColors.primary,
                                  textShadowColor: isDark 
                                    ? 'rgba(0, 0, 0, 0.4)' 
                                    : 'rgba(255, 255, 255, 0.9)',
                                  textShadowOffset: { width: 0, height: 2 },
                                  textShadowRadius: 4,
                                }}
                              >
                                {deckIcon}
                              </Text>
                            </View>
                          </View>
                          <Text className="text-xl font-bold text-gray-900 mb-2 leading-6 text-center">
                            {deck.name}
                          </Text>
                          <Text className="text-gray-700 text-sm mb-3 leading-4 text-center">
                            {isSpiceDeck 
                              ? 'Premium Only' 
                              : userHasPremium 
                                ? `${totalQuestions} questions` 
                                : `${freeQuestions}/${totalQuestions} free`
                            }
                          </Text>
                        </View>
                        
                        {/* Premium Badge */}
                        {isSpiceDeck && (
                          <View className="mb-3 self-center bg-yellow-500 rounded-full px-4 py-2">
                            <Text className="text-black text-xs font-bold">PREMIUM</Text>
                          </View>
                        )}
                        
                        {/* Enhanced Action Icon */}
                        <View 
                          className="items-center justify-center rounded-full w-12 h-12 self-center"
                          style={{
                            backgroundColor: isDark 
                              ? 'rgba(255, 255, 255, 0.25)' 
                              : 'rgba(255, 255, 255, 0.9)',
                            shadowColor: deckColors.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 4,
                            borderWidth: 1,
                            borderColor: isDark 
                              ? `${deckColors.primary}30` 
                              : `${deckColors.primary}20`,
                          }}
                        >
                          {isSpiceDeck && !userHasPremium ? (
                            <Text className="text-lg font-bold text-gray-500 dark:text-gray-300">LOCK</Text>
                          ) : (
                            <Text 
                              className="text-xl"
                              style={{ 
                                color: isDark 
                                  ? deckColors.primary 
                                  : deckColors.primary,
                                fontWeight: 'bold',
                              }}
                            >
                              →
                            </Text>
                          )}
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