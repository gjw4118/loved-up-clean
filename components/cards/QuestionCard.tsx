// QuestionCard Component
// Beautiful, focused single question card with premium typography and smooth interactions

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
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
  // Theme
  const { isDark } = useTheme();
  
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
              shadowColor: deckColors.primary,
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.25,
              shadowRadius: 30,
              elevation: 20,
            },
          ]}
          className="rounded-3xl overflow-hidden"
        >
          {/* Enhanced Colored Background with Gradient */}
          <LinearGradient
            colors={[`${deckColors.primary}25`, `${deckColors.secondary}15`]}
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
          
          {/* Enhanced overlay for readability - theme aware */}
          <View 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 24,
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.6)',
            }}
          />
          
          {/* Enhanced accent border with glow effect */}
          <View 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 24,
              borderWidth: 2,
              borderColor: `${deckColors.primary}50`,
              shadowColor: deckColors.primary,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
            }}
          />

          {/* Content */}
          <View className="flex-1 p-8 justify-between">
            {/* Question Text Section - Enhanced typography for glass backgrounds */}
            <View className="flex-1 justify-center items-center pt-8">
              <Text 
                className="text-center leading-tight px-6"
                style={{
                  fontSize: 44,
                  fontWeight: '600', // Increased from '200' for better readability
                  letterSpacing: -0.8,
                  lineHeight: 52,
                  color: isDark ? '#ffffff' : '#1a1a1a', // Theme-aware color
                  textShadowColor: isDark 
                    ? 'rgba(0, 0, 0, 0.8)' 
                    : 'rgba(255, 255, 255, 0.9)', // Better contrast
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                  fontFamily: 'System', // Keep system font but with better weight
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