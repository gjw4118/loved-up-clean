import { useQuestionCardAnimation } from '@/lib/contexts/QuestionCardAnimationContext';
import { useQuestionStackAnimation } from '@/lib/contexts/QuestionStackAnimationContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

// SwipeIndicators Component
// Visual feedback during card drag (colored backgrounds + progress indication)
// Inspired by Slack's swipe hint UI

export const SwipeIndicators: FC = () => {
  const { isDragging } = useQuestionStackAnimation();
  const { panX, panDistance } = useQuestionCardAnimation();

  // Fade in/out based on drag state
  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isDragging.value ? 1 : 0, { duration: 150 }),
    };
  });

  // Progress for left swipe (skip)
  const leftProgressStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(Math.min(panX.value, 0)) / panDistance, 1);
    return {
      opacity: progress * 0.8,
    };
  });

  // Progress for right swipe (complete)
  const rightProgressStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.max(panX.value, 0) / panDistance, 1);
    return {
      opacity: progress * 0.8,
    };
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, containerStyle]}
      pointerEvents="none"
    >
      {/* Left Swipe Indicator (Skip - Neutral Blue-Gray) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingLeft: 40,
          },
          leftProgressStyle,
        ]}
      >
        <LinearGradient
          colors={['rgba(100, 116, 139, 0.4)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(100, 116, 139, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: 'white',
              borderRadius: 2,
            }}
          />
        </View>
      </Animated.View>

      {/* Right Swipe Indicator (Complete - Neutral Green-Gray) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingRight: 40,
          },
          rightProgressStyle,
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(74, 222, 128, 0.4)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(74, 222, 128, 0.7)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 24,
              height: 4,
              backgroundColor: 'white',
              borderRadius: 2,
              transform: [{ rotate: '45deg' }],
              position: 'absolute',
              top: 36,
              left: 24,
            }}
          />
          <View
            style={{
              width: 36,
              height: 4,
              backgroundColor: 'white',
              borderRadius: 2,
              transform: [{ rotate: '-45deg' }],
              position: 'absolute',
              top: 44,
              left: 30,
            }}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

