// Connect App Authentication Screen
// Hybrid UI: HeroUI Native + iOS 26 Glass Components

import React, { useState, useEffect } from 'react';
import { View, Text, Alert, SafeAreaView } from 'react-native';
import { LinearGradient, StatusBar } from '@/components/ui';
import { GlassCard, GlassButton } from '@/components/ui';
import { signInWithApple, signInWithGoogle, isAppleSignInAvailable } from '@/lib/auth/supabase-auth';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

export default function ConnectAuthScreen() {
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
    <SafeAreaView className="flex-1">
      <StatusBar style="light" />
      
      {/* iOS 26 Gradient Background */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E', '#FFB347']}
        className="absolute inset-0"
      />
      
      {/* Content Container */}
      <View className="flex-1 justify-center items-center px-8">
        {/* Brand Section */}
        <View className="items-center mb-16">
          <Text className="text-7xl mb-6">💬</Text>
          <Text className="text-5xl font-bold text-white mb-4">Connect</Text>
          <Text className="text-xl text-white/90 text-center leading-7">
            Meaningful questions to deepen{'\n'}your relationships
          </Text>
        </View>

        {/* iOS 26 Glass Authentication Card */}
        <GlassCard
          intensity={25}
          tint="light"
          className="w-full"
          radius="2xl"
        >
          <View className="p-6 space-y-4">
            {/* Apple Sign-In (iOS only) */}
            {appleAvailable && (
              <GlassButton
                onPress={handleAppleSignIn}
                disabled={loading}
                loading={loading}
                intensity={20}
                tint="dark"
                size="lg"
                className="bg-black/10"
                startContent={
                  <Text className="text-2xl">🍎</Text>
                }
              >
                <Text className="text-white font-semibold text-lg">
                  Continue with Apple
                </Text>
              </GlassButton>
            )}

            {/* Google Sign-In */}
            <GlassButton
              onPress={handleGoogleSignIn}
              disabled={loading}
              loading={loading}
              intensity={40}
              tint="light"
              size="lg"
              className="bg-white/20"
              startContent={
                <Text className="text-2xl">🔍</Text>
              }
            >
              <Text className="text-gray-800 font-semibold text-lg">
                Continue with Google
              </Text>
            </GlassButton>

            {/* Privacy Notice */}
            <Text className="text-sm text-white/70 text-center mt-6 leading-5">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              Your data is secure and never shared without permission.
            </Text>
          </View>
        </GlassCard>

        {/* Features Preview */}
        <View className="mt-12 space-y-4">
          <FeatureItem icon="🎯" text="4 curated question decks" />
          <FeatureItem icon="💝" text="Share questions via iMessage" />
          <FeatureItem icon="📱" text="Beautiful iOS native design" />
          <FeatureItem icon="🔒" text="Private & secure conversations" />
        </View>
      </View>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
}

function FeatureItem({ icon, text }: FeatureItemProps) {
  return (
    <View className="flex-row items-center space-x-3">
      <Text className="text-2xl">{icon}</Text>
      <Text className="text-white/90 text-base font-medium">{text}</Text>
    </View>
  );
}
