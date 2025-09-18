// Beautiful HeroUI Pro Authentication Screen for React Native
// Adapted from HeroUI Pro design with React Native animations for GoDeeper App

import { useTheme } from '@/hooks/useTheme';
import { isAppleSignInAvailable, signInWithApple } from '@/lib/auth/supabase-auth';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Button, Card, Divider, TextField } from 'heroui-native';
import React, { useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const [loading, setLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Use proper theme system
  const { theme, isDark } = useTheme();
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const formOpacity = useState(new Animated.Value(0))[0];
  const formTranslateY = useState(new Animated.Value(20))[0];

  useEffect(() => {
    checkAppleAvailability();
    // Initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const checkAppleAvailability = async () => {
    const available = await isAppleSignInAvailable();
    setAppleAvailable(available);
  };

  const showForm = () => {
    setIsFormVisible(true);
    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideForm = () => {
    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsFormVisible(false);
    });
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
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Apple Sign-In Error:', error);
      Alert.alert('Sign In Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // TODO: Implement email/password authentication
      Alert.alert('Coming Soon', 'Email authentication will be available soon!');
      
    } catch (error) {
      console.error('Email Sign-In Error:', error);
      Alert.alert('Sign In Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const OrDivider = () => (
    <View className="flex-row items-center gap-4 py-2">
      <Divider className="flex-1" />
      <Text className={`text-sm shrink-0 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>OR</Text>
      <Divider className="flex-1" />
    </View>
  );

  return (
    <View className="flex-1">
      {/* Dynamic Background based on theme */}
      <LinearGradient
        colors={isDark 
          ? ['#0F0F23', '#1A1A2E', '#16213E', '#0F3460'] 
          : ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />
      
      {/* Content Container */}
      <Animated.View 
        className="flex-1 justify-center items-center px-8"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* App Icon */}
        <View className="items-center mb-8">
          <Image
            source={require('@/assets/icon-1758170521699.png')}
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
            }}
            resizeMode="contain"
          />
          <Text className={`text-2xl font-bold mt-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            GoDeeper
          </Text>
          <Text className={`text-base mt-2 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Meaningful questions to deepen your relationships
          </Text>
        </View>

        {/* Authentication Card */}
        <BlurView
          intensity={30}
          tint={isDark ? 'dark' : 'light'}
          className="w-full max-w-sm rounded-3xl overflow-hidden"
        >
          <Card 
            className={`${isDark ? 'bg-white/15' : 'bg-white/90'} backdrop-blur-sm`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: isDark ? 0.4 : 0.15,
              shadowRadius: 20,
              elevation: 12,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
            }}
          >
            <View className="flex flex-col gap-4 px-8 pt-6 pb-10">
              <Text className={`mb-4 text-xl font-medium text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Log In
              </Text>
              
              {isFormVisible ? (
                <Animated.View
                  style={{
                    opacity: formOpacity,
                    transform: [{ translateY: formTranslateY }],
                  }}
                  className="flex flex-col gap-y-3"
                >
                  <TextField
                    label="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="mb-2"
                    variant="bordered"
                  />
                  <TextField
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    className="mb-4"
                    variant="bordered"
                  />
                  <Button
                    className="w-full"
                    color="primary"
                    onPress={handleEmailSignIn}
                    isLoading={loading}
                  >
                    Log In
                  </Button>
                  
                  <OrDivider />
                  
                  <Button
                    fullWidth
                    variant="flat"
                    startContent={
                      <Ionicons
                        name="arrow-back"
                        size={18}
                        color={isDark ? "#9CA3AF" : "#6B7280"}
                      />
                    }
                    onPress={hideForm}
                  >
                    Other Login options
                  </Button>
                </Animated.View>
              ) : (
                <>
                  <Button
                    fullWidth
                    color="primary"
                    startContent={
                      <MaterialIcons 
                        name="email" 
                        size={24} 
                        color={isDark ? "white" : "white"}
                      />
                    }
                    onPress={showForm}
                  >
                    Continue with Email
                  </Button>
                  
                  <OrDivider />
                  
                  <View className="flex flex-col gap-y-2">
                    <View className="flex flex-col gap-2">
                      {appleAvailable && (
                        <Button
                          fullWidth
                          startContent={
                            <Ionicons 
                              name="logo-apple" 
                              size={24} 
                              color={isDark ? "white" : "black"}
                            />
                          }
                          variant="flat"
                          onPress={handleAppleSignIn}
                          isLoading={loading}
                        >
                          Continue with Apple
                        </Button>
                      )}
                      <Button
                        fullWidth
                        startContent={
                          <Ionicons 
                            name="logo-google" 
                            size={24} 
                            color="#4285F4"
                          />
                        }
                        variant="flat"
                      >
                        Continue with Google
                      </Button>
                    </View>
                    <Text className={`text-sm mt-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Need to create an account?{' '}
                      <Text className={`${isDark ? 'text-blue-400' : 'text-blue-600'} underline`}>
                        Sign Up
                      </Text>
                    </Text>
                  </View>
                </>
              )}
            </View>
          </Card>
        </BlurView>

        {/* Features Preview */}
        <View className="mt-12 space-y-3">
          <FeatureItem icon="💭" text="4 curated question decks" />
          <FeatureItem icon="📱" text="Share questions via iMessage" />
          <FeatureItem icon="✨" text="Beautiful iOS native design" />
        </View>
      </Animated.View>
    </View>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => {
  const { isDark } = useTheme();
  
  return (
    <View className="flex-row items-center space-x-3">
      <Text className="text-2xl">{icon}</Text>
      <Text className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{text}</Text>
    </View>
  );
};
