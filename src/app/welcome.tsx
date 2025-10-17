// Welcome Screen - Onboarding
// Apple Invites-style carousel showcasing 5 question decks
// Shows on first launch only

import { _itemWidth } from '@/components/onboarding/DeckMarqueeItem';
import { WelcomeCarousel } from '@/components/onboarding/WelcomeCarousel';
import { QUESTION_DECKS } from '@/constants/decks';
import { setOnboardingSeen } from '@/lib/storage/onboarding';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

// Welcome Screen Animation
// Inspired by Apple Invites with deck-specific backgrounds

export default function Welcome() {
  // Track which deck card is currently centered/active
  const [activeIndex, setActiveIndex] = useState(0);

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Shared value for horizontal scroll position
  const scrollOffsetX = useSharedValue(0);
  const allItemsWidth = QUESTION_DECKS.length * _itemWidth;

  // Get current active deck for background gradient
  const activeDeck = QUESTION_DECKS[activeIndex] as any;

  // Calculates which card is centered and updates active index
  useAnimatedReaction(
    () => scrollOffsetX.value,
    (currentValue) => {
      'worklet';
      // Normalize to handle infinite scroll wrapping
      const normalizedOffset = ((currentValue % allItemsWidth) + allItemsWidth) % allItemsWidth;
      const shift = width / 2;
      const activeItemIndex = Math.abs(Math.floor((normalizedOffset + shift) / _itemWidth));

      // Handle edge case
      if (activeItemIndex === QUESTION_DECKS.length) {
        scheduleOnRN(setActiveIndex, 0);
      }

      // Update active index only when it actually changes
      if (
        activeItemIndex >= 0 &&
        activeItemIndex < QUESTION_DECKS.length &&
        activeItemIndex !== activeIndex
      ) {
        scheduleOnRN(setActiveIndex, activeItemIndex);
      }
    }
  );

  const handleGetStarted = async () => {
    await setOnboardingSeen();
    router.replace('/auth');
  };

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom }}
    >
      {/* Background gradient that transitions with active deck */}
      <LinearGradient
        colors={activeDeck.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Carousel - 50% of screen height */}
      <View style={{ height: '50%', paddingTop: 24 }}>
        <WelcomeCarousel decks={QUESTION_DECKS as any} scrollOffsetX={scrollOffsetX} />
      </View>

      {/* Bottom section - 50% with content and button */}
      <View style={{ height: '50%', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, paddingBottom: 16, paddingHorizontal: 24 }}>
        {/* Welcome content */}
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          {/* App title */}
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 36,
              color: 'white',
              marginBottom: 12,
              textShadowColor: 'rgba(0, 0, 0, 0.3)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 8,
              letterSpacing: -0.5,
            }}
          >
            Welcome to GoDeeper
          </Text>

          {/* Welcome message */}
          <Text
            style={{
              textAlign: 'center',
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: 24,
              paddingHorizontal: 20,
              lineHeight: 28,
              textShadowColor: 'rgba(0, 0, 0, 0.3)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 4,
            }}
          >
            Spark meaningful conversations and deepen your connections through {QUESTION_DECKS.length} thoughtfully curated question decks
          </Text>

          {/* Page indicators */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            {QUESTION_DECKS.map((_, index) => (
              <View
                key={index}
                style={{
                  width: index === activeIndex ? 32 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: index === activeIndex ? 'white' : 'rgba(255, 255, 255, 0.4)',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: index === activeIndex ? 0.3 : 0,
                  shadowRadius: 4,
                }}
              />
            ))}
          </View>
        </View>

        {/* Let's Connect button - Custom Glass */}
        <Pressable
          onPress={handleGetStarted}
          style={{
            width: '80%',
            height: 64,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderColor: 'rgba(255, 255, 255, 0.4)',
            borderWidth: 1,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              color: 'white',
              textShadowColor: 'rgba(0, 0, 0, 0.3)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
              letterSpacing: 0.5,
            }}
          >
            Let's Connect
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

