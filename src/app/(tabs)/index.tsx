// GoDeeper App - Main Decks Screen (Premium Bento Grid)
// Sophisticated asymmetric bento grid layout with HeroUI styling

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeckBentoCard } from '@/components/cards';
import { StatusBar } from '@/components/ui';
import { useQuestionDecks } from '@/hooks/questions/useQuestions';
import { usePaywall } from '@/hooks/usePaywall';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { enrichDecks } from '@/utils/deckEnrichment';
import { resetOnboardingForTesting } from '@/lib/storage/onboarding';

// Enrich database decks with UI metadata
const createDeckList = (dbDecks: any[]) => {
  // Enrich database decks with UI metadata (gradients, images, icons)
  const enrichedDbDecks = enrichDecks(dbDecks);
  
  // All decks are now in the database including Spice
  return enrichedDbDecks;
};

export default function MainDecksScreen() {
  const { theme, isDark } = useTheme();
  
  // Debug theme
  React.useEffect(() => {
    console.log('🏠 Home Screen Theme:', { theme, isDark });
  }, [theme, isDark]);
  
  // Fetch decks from database
  const { data: dbDecks, isLoading: decksLoading } = useQuestionDecks();
  
  // Combine database decks with static Spice deck
  const decks = createDeckList(dbDecks || []);
  const { isPremium } = usePremiumStatus();
  const { isPresenting, presentPaywall } = usePaywall();

  const handleDeckSelect = async (deck: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Handle premium deck
    if (deck.isPremium && !isPremium) {
      presentPaywall('spice_deck_card');
      return;
    }
    
    console.log('Navigating to deck:', { deckId: deck.id, deckName: deck.name });
    
    // Navigate to question browsing screen
    router.push({
      pathname: '/questions/[deckId]',
      params: { deckId: deck.id, deckName: deck.name }
    });
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 32,
        }}
      >
        {/* Debug: Reset onboarding button */}
        <Pressable 
          onPress={async () => {
            await resetOnboardingForTesting();
            console.log('Onboarding reset - restart app to see welcome screen');
          }}
          className="mb-4 px-4 py-2 bg-red-500 rounded-lg"
        >
          <Text className="text-white text-sm">🧪 Reset Onboarding (Debug)</Text>
        </Pressable>
        {/* Premium Bento Grid Layout - Full Screen */}
        {decks && decks.length >= 5 && (
          <View style={{ gap: 12 }}>
            {/* Row 1: Two medium cards */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <DeckBentoCard
                  deck={decks[0]}
                  onPress={() => handleDeckSelect(decks[0])}
                  size="medium"
                  isDark={isDark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <DeckBentoCard
                  deck={decks[1]}
                  onPress={() => handleDeckSelect(decks[1])}
                  size="medium"
                  isDark={isDark}
                />
              </View>
            </View>

            {/* Row 2: One large card (Featured) */}
            <View>
              <DeckBentoCard
                deck={decks[2]}
                onPress={() => handleDeckSelect(decks[2])}
                size="large"
                isDark={isDark}
              />
            </View>

            {/* Row 3: Small card and medium card */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <DeckBentoCard
                  deck={decks[3]}
                  onPress={() => handleDeckSelect(decks[3])}
                  size="small"
                  isDark={isDark}
                />
              </View>
              <View style={{ flex: 1 }}>
                <DeckBentoCard
                  deck={decks[4]}
                  onPress={() => handleDeckSelect(decks[4])}
                  size="medium"
                  isDark={isDark}
                />
              </View>
            </View>
          </View>
        )}

        {/* Fallback: Simple grid for fewer decks */}
        {decks && decks.length > 0 && decks.length < 5 && (
          <View style={{ gap: 16 }}>
            {decks.map((deck) => (
              <DeckBentoCard
                key={deck.id}
                deck={deck}
                onPress={() => handleDeckSelect(deck)}
                size="medium"
                isDark={isDark}
              />
            ))}
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