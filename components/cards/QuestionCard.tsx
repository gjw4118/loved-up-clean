// QuestionCard Component
// Stunning swipeable question card with iOS 26 liquid glass effects

import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur';
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

import { GlassButton } from '@/components/ui';
import { getDeckColor } from '@/constants/Colors';
import { Question } from '@/types/questions';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32; // 16px margin on each side
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6; // 60% of screen height
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3; // 30% of screen width

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
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(handleComplete)();
      } else if (shouldSkip) {
        // Swipe left to skip
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        runOnJS(handleSkip)();
      } else {
        // Return to center
        translateX.value = withSpring(0, { damping: 20, stiffness: 300 });
        translateY.value = withSpring(0, { damping: 20, stiffness: 300 });
        scale.value = withSpring(1, { damping: 20, stiffness: 300 });
      }
    });

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });

  // Swipe indicator styles
  const leftIndicatorStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity: progress,
      transform: [{ scale: progress }],
    };
  });

  const rightIndicatorStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      opacity: progress,
      transform: [{ scale: progress }],
    };
  });

  return (
    <View className="items-center justify-center flex-1">
      {/* Swipe Indicators with Glass Effects */}
      <Animated.View
        style={[leftIndicatorStyle]}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-10"
      >
        {isLiquidGlassAvailable() ? (
          <GlassView
            glassEffectStyle="clear"
            isInteractive={false}
            tintColor="#EF4444"
            className="rounded-full p-4"
          >
            <View className="items-center">
              <Text className="text-white text-2xl mb-1">👈</Text>
              <Text className="text-white text-sm font-bold">Skip</Text>
            </View>
          </GlassView>
        ) : (
          <View className="bg-red-500/80 rounded-full p-4">
            <View className="items-center">
              <Text className="text-white text-2xl mb-1">👈</Text>
              <Text className="text-white text-sm font-bold">Skip</Text>
            </View>
          </View>
        )}
      </Animated.View>

      <Animated.View
        style={[rightIndicatorStyle]}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10"
      >
        {isLiquidGlassAvailable() ? (
          <GlassView
            glassEffectStyle="clear"
            isInteractive={false}
            tintColor="#10B981"
            className="rounded-full p-4"
          >
            <View className="items-center">
              <Text className="text-white text-2xl mb-1">👉</Text>
              <Text className="text-white text-sm font-bold">Done</Text>
            </View>
          </GlassView>
        ) : (
          <View className="bg-green-500/80 rounded-full p-4">
            <View className="items-center">
              <Text className="text-white text-2xl mb-1">👉</Text>
              <Text className="text-white text-sm font-bold">Done</Text>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Question Card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            cardAnimatedStyle,
            {
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
            },
          ]}
          className="rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Background Gradient */}
          <LinearGradient
            colors={deckColors.gradient}
            className="absolute inset-0"
          />

          {/* iOS 26 Liquid Glass Effect */}
          {isLiquidGlassAvailable() ? (
            <GlassView
              glassEffectStyle="regular"
              isInteractive={true}
              tintColor="#FFFFFF"
              className="absolute inset-0"
            />
          ) : (
            <BlurView
              intensity={20}
              tint="light"
              className="absolute inset-0"
            />
          )}

          {/* Content */}
          <View className="flex-1 p-8 justify-center">
            {/* Question Text */}
            <View className="flex-1 justify-center items-center">
              <Text className="text-3xl font-bold text-white text-center leading-10 mb-8">
                {question.text}
              </Text>

              {/* Question Metadata */}
              <View className="flex-row items-center space-x-4 mb-8">
                <View className="bg-white/20 rounded-full px-4 py-2">
                  <Text className="text-white font-medium capitalize">
                    {question.difficulty_level}
                  </Text>
                </View>
                {question.tags.length > 0 && (
                  <View className="bg-white/20 rounded-full px-4 py-2">
                    <Text className="text-white font-medium">
                      {question.tags[0]}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Action Buttons with Enhanced Glass Effects */}
            {showActions && (
              <View className="flex-row justify-between items-center">
                <GlassButton
                  onPress={handleSkip}
                  disabled={disabled}
                  intensity={40}
                  tint="dark"
                  className="bg-red-500/30 flex-1 mr-3"
                  radius="xl"
                >
                  <View className="flex-row items-center justify-center">
                    <Text className="text-white text-lg mr-2">👈</Text>
                    <Text className="text-white font-semibold text-lg">
                      Skip
                    </Text>
                  </View>
                </GlassButton>

                {onShare && (
                  <GlassButton
                    onPress={handleShare}
                    disabled={disabled}
                    intensity={40}
                    tint="dark"
                    className="bg-blue-500/30 mx-3"
                    radius="xl"
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className="text-white text-lg mr-2">📤</Text>
                      <Text className="text-white font-semibold text-lg">
                        Share
                      </Text>
                    </View>
                  </GlassButton>
                )}

                <GlassButton
                  onPress={handleComplete}
                  disabled={disabled}
                  intensity={40}
                  tint="dark"
                  className="bg-green-500/30 flex-1 ml-3"
                  radius="xl"
                >
                  <View className="flex-row items-center justify-center">
                    <Text className="text-white text-lg mr-2">✅</Text>
                    <Text className="text-white font-semibold text-lg">
                      Complete
                    </Text>
                  </View>
                </GlassButton>
              </View>
            )}
          </View>

          {/* Swipe Hint with Glass Effect */}
          <View className="absolute bottom-4 left-0 right-0 px-4">
            {isLiquidGlassAvailable() ? (
              <GlassView
                glassEffectStyle="clear"
                isInteractive={false}
                tintColor="#FFFFFF"
                className="rounded-full py-2 px-4"
              >
                <Text className="text-white/80 text-center text-sm font-medium">
                  👈 Swipe left to skip • Swipe right to complete 👉
                </Text>
              </GlassView>
            ) : (
              <View className="bg-white/10 rounded-full py-2 px-4">
                <Text className="text-white/80 text-center text-sm font-medium">
                  👈 Swipe left to skip • Swipe right to complete 👉
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
