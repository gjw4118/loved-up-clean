// GoDeeper App - Sophisticated Asymmetric Bento Grid Layout
// HeroUI-inspired card design with dynamic sizing

import { DeckBentoCard } from '@/components/cards';
import { StatusBar } from '@/components/ui';
import { getDeckColor } from '@/constants/Colors';
import { QUESTION_DECKS } from '@/constants/decks';
import { usePaywall } from '@/hooks/usePaywall';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


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
        

        {/* Deck Cards - Asymmetric Bento Grid */}
        {decks && decks.length > 0 && (
          <View style={{ gap: 16 }}>
            {/* Top Row: Large + Medium */}
            <View style={{ flexDirection: 'row', gap: 16, height: 280 }}>
              {/* Friends - Large card (left side) */}
              {decks[0] && (
                <View style={{ flex: 2 }}>
                  <DeckBentoCard
                    deck={{
                      id: decks[0].id,
                      name: decks[0].name,
                      description: decks[0].description,
                      icon: decks[0].icon,
                      color: getDeckColor(decks[0].category).primary,
                      gradient: [getDeckColor(decks[0].category).primary, getDeckColor(decks[0].category).secondary],
                      question_count: decks[0].question_count || 25,
                      isPremium: false,
                    }}
                    onPress={() => handleDeckSelect(decks[0].id, decks[0].name)}
                    size="large"
                    isDark={isDark}
                  />
                </View>
              )}
              {/* Family - Medium card (top right) */}
              {decks[1] && (
                <View style={{ flex: 1 }}>
                  <DeckBentoCard
                    deck={{
                      id: decks[1].id,
                      name: decks[1].name,
                      description: decks[1].description,
                      icon: decks[1].icon,
                      color: getDeckColor(decks[1].category).primary,
                      gradient: [getDeckColor(decks[1].category).primary, getDeckColor(decks[1].category).secondary],
                      question_count: decks[1].question_count || 25,
                      isPremium: false,
                    }}
                    onPress={() => handleDeckSelect(decks[1].id, decks[1].name)}
                    size="medium"
                    isDark={isDark}
                  />
                </View>
              )}
            </View>

            {/* Bottom Row: Two Medium cards */}
            <View style={{ flexDirection: 'row', gap: 16, height: 200 }}>
              {/* Dating - Medium card */}
              {decks[2] && (
                <View style={{ flex: 1 }}>
                  <DeckBentoCard
                    deck={{
                      id: decks[2].id,
                      name: decks[2].name,
                      description: decks[2].description,
                      icon: decks[2].icon,
                      color: getDeckColor(decks[2].category).primary,
                      gradient: [getDeckColor(decks[2].category).primary, getDeckColor(decks[2].category).secondary],
                      question_count: decks[2].question_count || 25,
                      isPremium: false,
                    }}
                    onPress={() => handleDeckSelect(decks[2].id, decks[2].name)}
                    size="medium"
                    isDark={isDark}
                  />
                </View>
              )}
              {/* Growing - Medium card */}
              {decks[3] && (
                <View style={{ flex: 1 }}>
                  <DeckBentoCard
                    deck={{
                      id: decks[3].id,
                      name: decks[3].name,
                      description: decks[3].description,
                      icon: decks[3].icon,
                      color: getDeckColor(decks[3].category).primary,
                      gradient: [getDeckColor(decks[3].category).primary, getDeckColor(decks[3].category).secondary],
                      question_count: decks[3].question_count || 25,
                      isPremium: false,
                    }}
                    onPress={() => handleDeckSelect(decks[3].id, decks[3].name)}
                    size="medium"
                    isDark={isDark}
                  />
                </View>
              )}
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