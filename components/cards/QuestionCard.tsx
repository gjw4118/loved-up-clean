// QuestionCard Component
// Beautiful, focused single question card with premium typography and smooth interactions

import * as Haptics from 'expo-haptics';
import React, { useCallback } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { getDeckColor } from '@/constants/Colors';
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
}

export default function QuestionCard({
  question,
  deckCategory,
  onComplete,
  onSkip,
  onShare,
  showActions = true,
  disabled = false,
}: QuestionCardProps) {
  // Animation values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

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
    .enabled(!disabled)
    .onStart(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onUpdate((event) => {
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
      const shouldComplete = event.translationX > SWIPE_THRESHOLD;
      const shouldSkip = event.translationX < -SWIPE_THRESHOLD;

      if (shouldComplete) {
        // Swipe right to complete
        translateX.value = withTiming(SCREEN_WIDTH * 1.5, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        rotation.value = withTiming(30, { duration: 300 });
        runOnJS(handleComplete)();
      } else if (shouldSkip) {
        // Swipe left to skip
        translateX.value = withTiming(-SCREEN_WIDTH * 1.5, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        rotation.value = withTiming(-30, { duration: 300 });
        runOnJS(handleSkip)();
      } else {
        // Return to center
        translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
        rotation.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
    });

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  // Swipe indicator styles
  // Note: Reanimated warning about reading from `value` during render is expected
  // and not harmful - this is the correct way to use shared values in useAnimatedStyle

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
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.15,
              shadowRadius: 30,
              elevation: 20,
            },
          ]}
          className="rounded-3xl overflow-hidden"
        >
          {/* Beautiful Subtle Colored Background */}
          <View 
            className="absolute inset-0 rounded-3xl"
            style={{
              backgroundColor: `${deckColors.primary}35`,
            }}
          />
          
          {/* Light overlay for readability */}
          <View 
            className="absolute inset-0 rounded-3xl"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
            }}
          />
          
          {/* Subtle accent border */}
          <View 
            className="absolute inset-0 rounded-3xl border-2"
            style={{
              borderColor: `${deckColors.primary}40`,
            }}
          />

          {/* Content */}
          <View className="flex-1 p-8 justify-between">
            {/* Question Text Section - Clean and focused */}
            <View className="flex-1 justify-center items-center pt-8">
              <Text 
                className="text-5xl font-light text-gray-900 text-center leading-tight px-6"
                style={{
                  fontFamily: 'System',
                  fontWeight: '200',
                  letterSpacing: -0.6,
                  lineHeight: 56,
                }}
              >
                {question.text}
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}