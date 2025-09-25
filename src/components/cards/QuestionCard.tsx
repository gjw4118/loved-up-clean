// QuestionCard Component
// Beautiful, focused single question card with premium typography and smooth interactions

import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { getDeckColor } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Question } from '@/types/questions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40; // 20px margin on each side
const CARD_HEIGHT = SCREEN_HEIGHT * 0.55; // 55% of screen height (smaller)
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25; // 25% of screen width

interface QuestionCardProps {
  question: Question;
  deckCategory: string;
  onComplete?: (questionId: string) => void;
  onSkip?: (questionId: string) => void;
  onShare?: (questionId: string) => void;
  showActions?: boolean;
  disabled?: boolean;
  isInStack?: boolean;
  stackPosition?: 'top' | 'bottom';
}

export default function QuestionCard({
  question,
  deckCategory,
  onComplete,
  onSkip,
  onShare,
  showActions = true,
  disabled = false,
  isInStack = false,
  stackPosition = 'top',
}: QuestionCardProps) {
  // Theme
  const { isDark } = useTheme();

  // Debug logging for question navigation
  console.log('QuestionCard render:', {
    questionId: question?.id,
    questionText: question?.text ? question.text.substring(0, 50) + '...' : 'no text',
    deckCategory,
    hasQuestion: !!question,
    hasText: !!(question?.text)
  });

  // Safety check for question - fallback to test data if needed
  if (!question || !question.text) {
    return (
      <View className="items-center justify-center flex-1 px-6">
        <View className="w-full h-96 rounded-3xl items-center justify-center bg-gray-100 dark:bg-gray-800">
          <Text className="text-lg text-gray-600 dark:text-gray-300">
            {question ? 'No question text available' : 'Loading question...'}
          </Text>
          {question && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Question ID: {question.id}
            </Text>
          )}
        </View>
      </View>
    );
  }
  
  // Animation values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(stackPosition === 'top' ? 1 : 0.92);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Stack positioning values
  const stackTranslateY = useSharedValue(stackPosition === 'top' ? 0 : -8);

  // Get deck colors
  const deckColors = getDeckColor(deckCategory);

  // Handle complete action
  const handleComplete = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onComplete?.(question.id);
  }, [question.id, onComplete]);

  // Handle skip action
  const handleSkip = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSkip?.(question.id);
  }, [question.id, onSkip]);

  // Handle share action
  const handleShare = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onShare?.(question.id);
  }, [question.id, onShare]);

  // Swipe gesture handler
  const panGesture = Gesture.Pan()
    .enabled(!disabled && stackPosition === 'top')
    .onStart(() => {
      if (stackPosition === 'top') {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    })
    .onUpdate((event) => {
      if (isInStack && stackPosition !== 'top') return; // Only allow gestures for top card

      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.1; // Subtle vertical movement

      // Add subtle rotation based on swipe direction
      rotation.value = interpolate(
        event.translationX,
        [-SWIPE_THRESHOLD, SWIPE_THRESHOLD],
        [-15, 15],
        Extrapolate.CLAMP
      );

      // Scale down slightly when swiping
      const progress = Math.abs(event.translationX) / SWIPE_THRESHOLD;
      scale.value = interpolate(
        progress,
        [0, 1],
        [1, 0.95],
        Extrapolate.CLAMP
      );
    })
    .onEnd((event) => {
      if (isInStack && stackPosition !== 'top') return; // Only allow gestures for top card

      const shouldComplete = event.translationX > SWIPE_THRESHOLD;
      const shouldSkip = event.translationX < -SWIPE_THRESHOLD;

      if (shouldComplete) {
        // Swipe right to complete - beautiful Tinder-like animation
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { 
          duration: 500,
          easing: Easing.out(Easing.cubic)
        });
        opacity.value = withTiming(0, { 
          duration: 400,
          easing: Easing.out(Easing.cubic)
        });
        rotation.value = withTiming(25, { 
          duration: 500,
          easing: Easing.out(Easing.cubic)
        });
        // Delay the callback to let animation complete
        setTimeout(() => {
          runOnJS(handleComplete)();
        }, 100);
      } else if (shouldSkip) {
        // Swipe left to skip - beautiful Tinder-like animation
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { 
          duration: 500,
          easing: Easing.out(Easing.cubic)
        });
        opacity.value = withTiming(0, { 
          duration: 400,
          easing: Easing.out(Easing.cubic)
        });
        rotation.value = withTiming(-25, { 
          duration: 500,
          easing: Easing.out(Easing.cubic)
        });
        // Delay the callback to let animation complete
        setTimeout(() => {
          runOnJS(handleSkip)();
        }, 100);
      } else {
        // Return to center with natural spring physics
        translateX.value = withSpring(0, { 
          damping: 15, 
          stiffness: 150,
          mass: 0.8
        });
        translateY.value = withSpring(0, { 
          damping: 15, 
          stiffness: 150,
          mass: 0.8
        });
        scale.value = withSpring(stackPosition === 'top' ? 1 : 0.92, { 
          damping: 15, 
          stiffness: 150,
          mass: 0.8
        });
        rotation.value = withSpring(0, { 
          damping: 15, 
          stiffness: 150,
          mass: 0.8
        });
      }
    });

  // Animated styles - using useDerivedValue to avoid accessing .value during render
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + stackTranslateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  // Swipe indicator styles
  // Reanimated warnings have been fixed by configuring the logger in _layout.tsx
  // This is the correct way to use shared values in useAnimatedStyle

  return (
    <View className="items-center justify-center flex-1 px-6">
      {/* Main Question Card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            cardAnimatedStyle,
            {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              shadowColor: deckColors.primary,
              shadowOffset: { width: 0, height: stackPosition === 'top' ? 20 : 8 },
              shadowOpacity: stackPosition === 'top' ? 0.25 : 0.08,
              shadowRadius: stackPosition === 'top' ? 30 : 12,
              elevation: stackPosition === 'top' ? 20 : 8,
              borderWidth: stackPosition === 'top' ? 1 : 1,
              borderColor: stackPosition === 'top' ? (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)') : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
            },
          ]}
          className="rounded-3xl overflow-hidden"
        >
          {/* Clean Glass Background */}
          <View 
            className={`absolute inset-0 rounded-3xl backdrop-blur-xl border ${isDark ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20'}`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
            }}
          />

          {/* Content */}
          <View className="flex-1 p-8 justify-between">
            {/* Question Text Section - Enhanced typography for clean backgrounds */}
            <View className="flex-1 justify-center items-center pt-8">
              <Text
                className="text-center leading-tight px-6"
                style={{
                  fontSize: stackPosition === 'top' ? 44 : 32,
                  fontWeight: '600',
                  letterSpacing: -0.8,
                  lineHeight: stackPosition === 'top' ? 52 : 38,
                  color: isDark ? '#ffffff' : '#000000',
                  textShadowColor: isDark
                    ? 'rgba(0, 0, 0, 0.5)'
                    : 'rgba(255, 255, 255, 0.8)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: stackPosition === 'top' ? 4 : 2,
                  fontFamily: 'Snell Roundhand', // Beautiful cursive font
                  opacity: 1,
                }}
              >
                {question.text || 'Loading question...'}
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}