import { QuestionDeck } from '@/types/questions';
import React, { FC, memo } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
    Easing,
    SharedValue,
    useFrameCallback,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { DeckMarqueeItem, _itemWidth } from './DeckMarqueeItem';

// WelcomeCarousel Component
// Auto-scrolling carousel with momentum drag
// Inspired by Apple Invites marquee

const DEFAULT_SCROLL_SPEED = 40; // Auto-scroll velocity in pixels per second

interface WelcomeCarouselProps {
  decks: QuestionDeck[];
  scrollOffsetX: SharedValue<number>;
}

const WelcomeCarouselComponent: FC<WelcomeCarouselProps> = ({ decks, scrollOffsetX }) => {
  const scrollSpeed = useSharedValue(DEFAULT_SCROLL_SPEED);
  const allItemsWidth = decks.length * _itemWidth;

  // Frame-based animation loop for smooth scrolling
  useFrameCallback((frameInfo) => {
    'worklet';
    // Convert frame time to seconds for consistent speed across devices
    const deltaSeconds = (frameInfo?.timeSincePreviousFrame ?? 0) / 1000;
    // Update scroll position based on current velocity
    scrollOffsetX.value += scrollSpeed.value * deltaSeconds;
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      // Stop auto-scroll when user starts dragging
      scrollSpeed.value = 0;
    })
    .onChange((event) => {
      'worklet';
      // Apply drag movement directly to scroll position
      scrollOffsetX.value -= event.changeX;
    })
    .onFinalize((event) => {
      'worklet';
      // Use gesture velocity to create momentum-based scrolling
      scrollSpeed.value = -event.velocityX;
      // Gradually return to auto-scroll speed with smooth easing
      scrollSpeed.value = withTiming(DEFAULT_SCROLL_SPEED, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });
    });

  return (
    <GestureDetector gesture={gesture}>
      <View className="h-full flex-row">
        {/* Render all cards simultaneously - positioning handled by individual items */}
        {decks.map((deck, index) => (
          <DeckMarqueeItem
            key={deck.id}
            deck={deck}
            index={index}
            scrollOffsetX={scrollOffsetX}
            allItemsWidth={allItemsWidth}
          />
        ))}
      </View>
    </GestureDetector>
  );
};

export const WelcomeCarousel = memo(WelcomeCarouselComponent);

