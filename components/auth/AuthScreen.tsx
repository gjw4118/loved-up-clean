// Connect App Authentication Screen
// Apple Sign-In only with native iOS design

import { isAppleSignInAvailable, signInWithApple } from '@/lib/auth/supabase-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Image, SafeAreaView, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  useEffect(() => {
    checkAppleAvailability();
    
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const checkAppleAvailability = async () => {
    const available = await isAppleSignInAvailable();
    setAppleAvailable(available);
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const { data, error } = await signInWithApple();
      
      if (error) {
        Alert.alert('Sign In Error', 'Failed to sign in with Apple. Please try again.');
        return;
      }

      if (data?.user) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      Alert.alert('Sign In Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E', '#FFD700']}
        className="absolute inset-0"
      />
      
      {/* Content Container */}
      <Animated.View 
        className="flex-1 justify-center items-center px-8"
        style={{
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        }}
      >
        {/* Logo/Brand Section */}
        <View className="items-center mb-16">
          <Image
            source={require('@/assets/icon-1758170521699.png')}
            style={{
              width: 120,
              height: 120,
              borderRadius: 24,
            }}
            resizeMode="contain"
          />
          <Text className="text-5xl font-bold text-white mb-4 text-center">
            GoDeeper
          </Text>
          <Text className="text-xl text-white/90 text-center leading-7 max-w-sm">
            Meaningful questions to deepen{'\n'}your relationships
          </Text>
        </View>

        {/* Apple Sign-In Button - Centerpiece */}
        {appleAvailable ? (
          <View className="w-full max-w-sm">
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
              cornerRadius={12}
              style={{
                width: '100%',
                height: 56,
                marginBottom: 16,
              }}
              onPress={handleAppleSignIn}
            />
            
            {loading && (
              <View className="items-center mt-4">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white/80 text-sm mt-2">Signing in...</Text>
              </View>
            )}
          </View>
        ) : (
          <View className="w-full max-w-sm items-center py-8">
            <Text className="text-white/80 text-center text-lg mb-4">
              Apple Sign-In is not available on this device
            </Text>
            <Text className="text-white/60 text-center text-sm">
              Please use a device with iOS 13+ or macOS 10.15+
            </Text>
          </View>
        )}

        {/* Privacy Notice */}
        <Text className="text-sm text-white/70 text-center mt-12 max-w-sm leading-5">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          Your data is secure and never shared without permission.
        </Text>

      </Animated.View>
    </SafeAreaView>
  );
}
