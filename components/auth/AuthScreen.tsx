// Authentication Screen for Connect App
// Based on PRD requirements with iOS 26 design patterns

import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { Button } from 'heroui-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { signInWithApple, signInWithGoogle, isAppleSignInAvailable } from '@/lib/auth/supabase-auth';
import { router } from 'expo-router';

export const AuthScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    checkAppleAvailability();
  }, []);

  const checkAppleAvailability = async () => {
    const available = await isAppleSignInAvailable();
    setAppleAvailable(available);
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const { data, error } = await signInWithApple();
      
      if (error) {
        Alert.alert('Sign In Error', 'Failed to sign in with Apple. Please try again.');
        return;
      }

      if (data?.user) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(protected)');
      }
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      Alert.alert('Sign In Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        Alert.alert('Sign In Error', 'Failed to sign in with Google. Please try again.');
        return;
      }

      if (data?.user) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(protected)');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Sign In Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        className="absolute inset-0"
      />
      
      {/* Content Container */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Logo/Brand Section */}
        <View className="items-center mb-16">
          <Text className="text-6xl mb-4">💬</Text>
          <Text className="text-4xl font-bold text-white mb-2">Connect</Text>
          <Text className="text-lg text-white/80 text-center">
            Meaningful questions to deepen your relationships
          </Text>
        </View>

        {/* Authentication Buttons */}
        <BlurView
          intensity={20}
          tint="light"
          className="w-full rounded-3xl p-6 overflow-hidden"
        >
          <View className="space-y-4">
            {appleAvailable && (
              <Button
                onPress={handleAppleSignIn}
                disabled={loading}
                className="w-full h-14 bg-black"
                radius="lg"
              >
                <View className="flex-row items-center space-x-3">
                  <Text className="text-2xl">🍎</Text>
                  <Text className="text-white font-semibold text-lg">
                    Continue with Apple
                  </Text>
                </View>
              </Button>
            )}

            <Button
              onPress={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-14 bg-white"
              radius="lg"
            >
              <View className="flex-row items-center space-x-3">
                <Text className="text-2xl">🔍</Text>
                <Text className="text-gray-800 font-semibold text-lg">
                  Continue with Google
                </Text>
              </View>
            </Button>
          </View>

          {/* Privacy Notice */}
          <Text className="text-sm text-gray-600 text-center mt-6 leading-5">
            By continuing, you agree to our Terms of Service and Privacy Policy.
            Your data is secure and never shared without permission.
          </Text>
        </BlurView>

        {/* Features Preview */}
        <View className="mt-12 space-y-3">
          <FeatureItem icon="🎯" text="4 curated question decks" />
          <FeatureItem icon="💝" text="Share questions via iMessage" />
          <FeatureItem icon="📱" text="Beautiful iOS native design" />
        </View>
      </View>
    </View>
  );
};

interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <View className="flex-row items-center space-x-3">
    <Text className="text-2xl">{icon}</Text>
    <Text className="text-white/90 text-base">{text}</Text>
  </View>
);
