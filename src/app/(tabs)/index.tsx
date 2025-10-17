// GoDeeper App - Main Decks Screen (Premium Bento Grid)
// Sophisticated asymmetric bento grid layout with HeroUI styling

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeckBentoCard } from '@/components/cards';
import { StatusBar } from '@/components/ui';
import { useQuestionDecks } from '@/hooks/questions/useQuestions';
import { usePaywall } from '@/hooks/usePaywall';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { enrichDeck, enrichDecks } from '@/utils/deckEnrichment';

// Enrich database decks with UI metadata
const createDeckList = (dbDecks: any[]) => {
  // Enrich database decks with UI metadata (gradients, images, icons)
  const enrichedDbDecks = enrichDecks(dbDecks);
  
  // Add coming soon decks
  const comingSoonDecks = [
    {
      id: 'siblings-coming-soon',
      name: 'Siblings',
      description: 'Strengthen bonds with brothers and sisters',
      category: 'siblings',
      icon: '👫',
      question_count: 0,
      popularity_score: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isPremium: false,
      isComingSoon: true,
    },
    {
      id: 'parents-coming-soon',
      name: 'Parents',
      description: 'Improving relationship with parents',
      category: 'parents',
      icon: '👨‍👩‍👧‍👦',
      question_count: 0,
      popularity_score: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isPremium: false,
      isComingSoon: true,
    },
    {
      id: 'new-baby-coming-soon',
      name: 'New Baby',
      description: 'For couples expecting a baby',
      category: 'new-baby',
      icon: '👶',
      question_count: 0,
      popularity_score: 0,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isPremium: false,
      isComingSoon: true,
    },
  ];

  // Enrich coming soon decks
  const enrichedComingSoonDecks = comingSoonDecks.map(deck => enrichDeck(deck));
  
  // Combine database decks with coming soon decks
  return [...enrichedDbDecks, ...enrichedComingSoonDecks];
};

export default function MainDecksScreen() {
  const { theme, isDark } = useTheme();
  const [navigatingToDeck, setNavigatingToDeck] = useState<string | null>(null);
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  console.log('📚 MainDecksScreen: Component rendered');
  
  // Fetch decks from database
  const { data: dbDecks, isLoading: decksLoading } = useQuestionDecks();
  
  console.log('📚 MainDecksScreen: Decks loading state:', decksLoading, 'Decks count:', dbDecks?.length);
  
  // Combine database decks with static Spice deck
  const decks = createDeckList(dbDecks || []);
  const { isPremium } = usePremiumStatus();
  const { isPresenting, presentPaywall } = usePaywall();

  // Calculate available height for cards (excluding safe areas and tab bar)
  const TAB_BAR_HEIGHT = 90; // Approximate tab bar height
  const VERTICAL_PADDING = 16; // Top and bottom padding
  const availableHeight = screenHeight - insets.top - insets.bottom - TAB_BAR_HEIGHT - VERTICAL_PADDING;
  
  // Calculate dynamic heights for rows with gaps (12px between rows)
  const ROW_GAP = 12;
  const totalGaps = 2 * ROW_GAP; // 2 gaps between 3 rows
  const usableHeight = availableHeight - totalGaps;
  
  // Row distribution: Row 1 (25%), Row 2 (40%), Row 3 (35%)
  const row1Height = Math.floor(usableHeight * 0.25);
  const row2Height = Math.floor(usableHeight * 0.40);
  const row3Height = Math.floor(usableHeight * 0.35);

  console.log('📐 Responsive Bento Grid Calculated Heights:', {
    screenHeight,
    availableHeight,
    usableHeight,
    row1Height,
    row2Height,
    row3Height,
    totalCalculated: row1Height + row2Height + row3Height + totalGaps,
  });

  const handleDeckSelect = async (deck: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Handle coming soon decks
    if (deck.isComingSoon) {
      // Don't navigate, just show haptic feedback
      return;
    }
    
    // Handle premium deck
    if (deck.isPremium && !isPremium) {
      presentPaywall('spice_deck_card');
      return;
    }
    
    console.log('Navigating to deck:', { deckId: deck.id, deckName: deck.name });
    
    // Set loading state to prevent visual glitches
    setNavigatingToDeck(deck.id);
    
    // Small delay to allow press animation to complete smoothly
    setTimeout(() => {
      router.push({
        pathname: '/questions/[deckId]',
        params: { deckId: deck.id, deckName: deck.name }
      });
    }, 100);
  };


  // Show loading state while fetching decks
  if (decksLoading) {
    return (
      <SafeAreaView className="flex-1">
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <LinearGradient
          colors={isDark 
            ? ['#000000', '#0a0a0a', '#000000'] 
            : ['#fafafa', '#ffffff', '#fafafa']
          }
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#000000'} />
          <Text className="text-lg mt-6 text-gray-900 dark:text-white font-medium">
            Loading Decks...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient
        colors={isDark 
          ? ['#000000', '#0a0a0a', '#000000'] 
          : ['#fafafa', '#ffffff', '#fafafa']
        }
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <ScrollView 
        className="flex-1"
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Scrollable Grid Layout - All Decks */}
        {decks && decks.length > 0 && (
          <View style={{ gap: 16 }}>
            {/* Row 1: Two medium cards */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <DeckBentoCard
                  deck={decks[0]}
                  onPress={() => handleDeckSelect(decks[0])}
                  size="medium"
                  isDark={isDark}
                  isNavigating={navigatingToDeck === decks[0].id}
                />
              </View>
              <View style={{ flex: 1 }}>
                <DeckBentoCard
                  deck={decks[1]}
                  onPress={() => handleDeckSelect(decks[1])}
                  size="medium"
                  isDark={isDark}
                  isNavigating={navigatingToDeck === decks[1].id}
                />
              </View>
            </View>

            {/* Row 2: One large card (Featured) */}
            {decks[2] && (
              <View>
                <DeckBentoCard
                  deck={decks[2]}
                  onPress={() => handleDeckSelect(decks[2])}
                  size="large"
                  isDark={isDark}
                  isNavigating={navigatingToDeck === decks[2].id}
                />
              </View>
            )}

            {/* Row 3: Two medium cards */}
            {decks[3] && decks[4] && (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <DeckBentoCard
                    deck={decks[3]}
                    onPress={() => handleDeckSelect(decks[3])}
                    size="medium"
                    isDark={isDark}
                    isNavigating={navigatingToDeck === decks[3].id}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <DeckBentoCard
                    deck={decks[4]}
                    onPress={() => handleDeckSelect(decks[4])}
                    size="medium"
                    isDark={isDark}
                    isNavigating={navigatingToDeck === decks[4].id}
                  />
                </View>
              </View>
            )}

            {/* Row 4: Two medium cards */}
            {decks[5] && decks[6] && (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <DeckBentoCard
                    deck={decks[5]}
                    onPress={() => handleDeckSelect(decks[5])}
                    size="medium"
                    isDark={isDark}
                    isNavigating={navigatingToDeck === decks[5].id}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <DeckBentoCard
                    deck={decks[6]}
                    onPress={() => handleDeckSelect(decks[6])}
                    size="medium"
                    isDark={isDark}
                    isNavigating={navigatingToDeck === decks[6].id}
                  />
                </View>
              </View>
            )}

            {/* Row 5: Two medium cards */}
            {decks[7] && decks[8] && (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <DeckBentoCard
                    deck={decks[7]}
                    onPress={() => handleDeckSelect(decks[7])}
                    size="medium"
                    isDark={isDark}
                    isNavigating={navigatingToDeck === decks[7].id}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <DeckBentoCard
                    deck={decks[8]}
                    onPress={() => handleDeckSelect(decks[8])}
                    size="medium"
                    isDark={isDark}
                    isNavigating={navigatingToDeck === decks[8].id}
                  />
                </View>
              </View>
            )}

            {/* Row 6: One large card (Coming Soon Featured) */}
            {decks[9] && (
              <View>
                <DeckBentoCard
                  deck={decks[9]}
                  onPress={() => handleDeckSelect(decks[9])}
                  size="large"
                  isDark={isDark}
                  isNavigating={navigatingToDeck === decks[9].id}
                />
              </View>
            )}
          </View>
        )}

        {/* Empty State */}
        {(!decks || decks.length === 0) && (
          <View className="items-center justify-center py-20">
            <View 
              className="w-24 h-24 rounded-full items-center justify-center mb-6"
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              }}
            >
              <Text 
                className="text-4xl font-bold"
                style={{ 
                  color: isDark ? '#ffffff' : '#000000',
                  letterSpacing: 2,
                }}
              >
                Q
              </Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No Decks Available
            </Text>
            <Text className="text-center text-gray-600 dark:text-gray-300 leading-6 text-base px-8">
              Question decks will appear here once they're loaded
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}