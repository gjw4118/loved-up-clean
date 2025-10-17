// Focus Mode Prompt Component
// Beautiful modal that encourages users to enable Do Not Disturb for a more present experience

import { useTheme } from '@/lib/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import React, { FC, useEffect } from 'react';
import { Alert, Modal, Platform, Pressable, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
} from 'react-native-reanimated';

interface FocusModePromptProps {
  visible: boolean;
  onDismiss: () => void;
  onDontShowAgain: () => void;
}

export const FocusModePrompt: FC<FocusModePromptProps> = ({
  visible,
  onDismiss,
  onDontShowAgain,
}) => {
  const { isDark } = useTheme();
  const scale = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Animate entrance
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacity.value = withSpring(1);
      iconScale.value = withSequence(
        withDelay(200, withSpring(1.2, { damping: 10 })),
        withSpring(1, { damping: 12 })
      );
    } else {
      scale.value = withSpring(0);
      opacity.value = withSpring(0);
      iconScale.value = withSpring(0);
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const openSystemSettings = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (Platform.OS === 'ios') {
        // iOS: Open Focus/Do Not Disturb settings
        const url = 'App-Prefs:DO_NOT_DISTURB';
        const canOpen = await Linking.canOpenURL(url);
        
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          // Fallback to main settings
          await Linking.openSettings();
        }
      } else if (Platform.OS === 'android') {
        // Android: Open Do Not Disturb settings
        // Note: sendIntent is not available in expo-linking, use openSettings as fallback
        await Linking.openSettings();
      }
      
      onDismiss();
    } catch (error) {
      console.error('Error opening settings:', error);
      Alert.alert(
        'Manual Setup Required',
        Platform.OS === 'ios'
          ? 'Please go to Settings > Focus > Do Not Disturb to enable focus mode.'
          : 'Please go to Settings > Sound > Do Not Disturb to enable focus mode.'
      );
    }
  };

  const handleDontShowAgain = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Disable Focus Reminders?',
      'You can always re-enable this in Settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Disable',
          style: 'destructive',
          onPress: onDontShowAgain,
        },
      ]
    );
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <BlurView
        intensity={isDark ? 40 : 20}
        tint={isDark ? 'dark' : 'light'}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center px-6 bg-black/40">
          <Animated.View
            style={[containerStyle]}
            className={`w-full max-w-sm rounded-3xl overflow-hidden border ${
              isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-gray-200'
            }`}
          >
            {/* Header */}
            <View className={`px-6 py-8 ${isDark ? 'bg-neutral-800/50' : 'bg-gradient-to-b from-purple-50 to-white'}`}>
              <Animated.View style={[iconStyle]} className="items-center mb-4">
                <View className={`w-20 h-20 rounded-full items-center justify-center ${
                  isDark ? 'bg-purple-500/20' : 'bg-purple-100'
                }`}>
                  <Text className="text-4xl">🎯</Text>
                </View>
              </Animated.View>
              
              <Text className={`text-2xl font-bold text-center mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Stay Present
              </Text>
              
              <Text className={`text-base text-center ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Enable Do Not Disturb to minimize distractions and stay focused on what matters most.
              </Text>
            </View>

            {/* Benefits */}
            <View className="px-6 py-6 space-y-4">
              <BenefitRow
                icon="📵"
                text="Silence notifications"
                isDark={isDark}
              />
              <BenefitRow
                icon="💭"
                text="Stay in the moment"
                isDark={isDark}
              />
              <BenefitRow
                icon="💬"
                text="Deeper conversations"
                isDark={isDark}
              />
            </View>

            {/* Actions */}
            <View className="px-6 pb-6 space-y-3">
              {/* Primary Action */}
              <Pressable
                onPress={openSystemSettings}
                className={`rounded-2xl py-4 ${
                  isDark ? 'bg-purple-600' : 'bg-purple-500'
                }`}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Enable Focus Mode
                </Text>
              </Pressable>

              {/* Secondary Action */}
              <Pressable
                onPress={onDismiss}
                className={`rounded-2xl py-4 ${
                  isDark ? 'bg-neutral-800' : 'bg-gray-100'
                }`}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text className={`text-center font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Maybe Later
                </Text>
              </Pressable>

              {/* Tertiary Action */}
              <Pressable
                onPress={handleDontShowAgain}
                className="py-3"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Text className={`text-center text-sm ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Don't show this again
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </BlurView>
    </Modal>
  );
};

// Benefit Row Component
interface BenefitRowProps {
  icon: string;
  text: string;
  isDark: boolean;
}

const BenefitRow: FC<BenefitRowProps> = ({ icon, text, isDark }) => (
  <View className="flex-row items-center space-x-3">
    <View className={`w-10 h-10 rounded-full items-center justify-center ${
      isDark ? 'bg-neutral-800' : 'bg-gray-50'
    }`}>
      <Text className="text-xl">{icon}</Text>
    </View>
    <Text className={`text-base flex-1 ${
      isDark ? 'text-gray-200' : 'text-gray-700'
    }`}>
      {text}
    </Text>
  </View>
);

