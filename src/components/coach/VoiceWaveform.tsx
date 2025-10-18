// Voice Waveform Visual Feedback Component
// Provides animated visual feedback during voice interactions

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export type WaveformState = 'idle' | 'listening' | 'speaking' | 'processing';

interface VoiceWaveformProps {
  state: WaveformState;
  audioLevel?: number;
  size?: number;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  state,
  audioLevel = 0,
  size = 200,
}) => {
  // Animated values for each bar
  const bar1Height = useSharedValue(0.2);
  const bar2Height = useSharedValue(0.3);
  const bar3Height = useSharedValue(0.5);
  const bar4Height = useSharedValue(0.3);
  const bar5Height = useSharedValue(0.2);

  // Update animations based on state
  useEffect(() => {
    switch (state) {
      case 'idle':
        // Gentle pulse animation
        bar1Height.value = withRepeat(
          withSequence(
            withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        bar2Height.value = withRepeat(
          withSequence(
            withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        bar3Height.value = withRepeat(
          withSequence(
            withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        bar4Height.value = withRepeat(
          withSequence(
            withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.4, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        bar5Height.value = withRepeat(
          withSequence(
            withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        );
        break;

      case 'listening':
        // Reactive to audio level
        const level = Math.max(0.3, Math.min(0.9, audioLevel));
        bar1Height.value = withTiming(level * 0.6, { duration: 100 });
        bar2Height.value = withTiming(level * 0.8, { duration: 100 });
        bar3Height.value = withTiming(level, { duration: 100 });
        bar4Height.value = withTiming(level * 0.8, { duration: 100 });
        bar5Height.value = withTiming(level * 0.6, { duration: 100 });
        break;

      case 'speaking':
        // Active wave animation
        bar1Height.value = withRepeat(
          withSequence(
            withTiming(0.4, { duration: 300 }),
            withTiming(0.7, { duration: 300 })
          ),
          -1,
          true
        );
        bar2Height.value = withRepeat(
          withSequence(
            withTiming(0.5, { duration: 400 }),
            withTiming(0.8, { duration: 400 })
          ),
          -1,
          true
        );
        bar3Height.value = withRepeat(
          withSequence(
            withTiming(0.7, { duration: 500 }),
            withTiming(0.9, { duration: 500 })
          ),
          -1,
          true
        );
        bar4Height.value = withRepeat(
          withSequence(
            withTiming(0.5, { duration: 400 }),
            withTiming(0.8, { duration: 400 })
          ),
          -1,
          true
        );
        bar5Height.value = withRepeat(
          withSequence(
            withTiming(0.4, { duration: 300 }),
            withTiming(0.7, { duration: 300 })
          ),
          -1,
          true
        );
        break;

      case 'processing':
        // Processing dots animation
        bar1Height.value = withRepeat(
          withSequence(
            withTiming(0.3, { duration: 500 }),
            withTiming(0.6, { duration: 500 })
          ),
          -1,
          true
        );
        bar2Height.value = withRepeat(
          withSequence(
            withTiming(0.4, { duration: 500 }),
            withTiming(0.7, { duration: 500 })
          ),
          -1,
          true
        );
        bar3Height.value = withRepeat(
          withSequence(
            withTiming(0.5, { duration: 500 }),
            withTiming(0.8, { duration: 500 })
          ),
          -1,
          true
        );
        bar4Height.value = withRepeat(
          withSequence(
            withTiming(0.4, { duration: 500 }),
            withTiming(0.7, { duration: 500 })
          ),
          -1,
          true
        );
        bar5Height.value = withRepeat(
          withSequence(
            withTiming(0.3, { duration: 500 }),
            withTiming(0.6, { duration: 500 })
          ),
          -1,
          true
        );
        break;
    }
  }, [state, audioLevel]);

  // Get color based on state
  const getColor = (): string => {
    switch (state) {
      case 'idle':
        return '#9CA3AF'; // Gray
      case 'listening':
        return '#10B981'; // Green
      case 'speaking':
        return '#3B82F6'; // Blue
      case 'processing':
        return '#F59E0B'; // Orange
      default:
        return '#9CA3AF';
    }
  };

  const color = getColor();
  const barWidth = size / 12;
  const barSpacing = size / 20;

  // Animated styles for each bar
  const bar1Style = useAnimatedStyle(() => ({
    height: bar1Height.value * size,
  }));

  const bar2Style = useAnimatedStyle(() => ({
    height: bar2Height.value * size,
  }));

  const bar3Style = useAnimatedStyle(() => ({
    height: bar3Height.value * size,
  }));

  const bar4Style = useAnimatedStyle(() => ({
    height: bar4Height.value * size,
  }));

  const bar5Style = useAnimatedStyle(() => ({
    height: bar5Height.value * size,
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.bars}>
        <Animated.View
          style={[
            styles.bar,
            { width: barWidth, backgroundColor: color },
            bar1Style,
          ]}
        />
        <View style={{ width: barSpacing }} />
        <Animated.View
          style={[
            styles.bar,
            { width: barWidth, backgroundColor: color },
            bar2Style,
          ]}
        />
        <View style={{ width: barSpacing }} />
        <Animated.View
          style={[
            styles.bar,
            { width: barWidth, backgroundColor: color },
            bar3Style,
          ]}
        />
        <View style={{ width: barSpacing }} />
        <Animated.View
          style={[
            styles.bar,
            { width: barWidth, backgroundColor: color },
            bar4Style,
          ]}
        />
        <View style={{ width: barSpacing }} />
        <Animated.View
          style={[
            styles.bar,
            { width: barWidth, backgroundColor: color },
            bar5Style,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  bar: {
    borderRadius: 8,
    minHeight: 4,
  },
});

