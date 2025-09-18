// Connect App - Profile Screen
// Comprehensive glass design with user stats, settings, and interactions

import { GlassButton, GlassCard, LinearGradient, StatusBar } from '@/components/ui';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '@/lib/auth/AuthContext';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth();
  const colorScheme = useColorScheme();
  
  // Force theme detection - if colorScheme is null/undefined, default to 'light'
  const theme = colorScheme || 'light';
  const isDark = theme === 'dark';

  // Mock user stats - will be replaced with real data
  const userStats = {
    questionsCompleted: 47,
    favoriteQuestions: 12,
    decksCompleted: 2,
    streakDays: 5,
    totalTimeSpent: '2h 34m'
  };

  const handleSignOut = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await signOut();
    router.replace('/auth');
  };

  const handleEditProfile = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to edit profile screen
    console.log('Edit profile');
  };

  const handleSettings = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to settings screen
    router.push('/settings');
  };

  const handleShareApp = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Share app functionality
    console.log('Share app');
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Theme-aware Dynamic Gradient Background */}
      <LinearGradient
        colors={isDark 
          ? ['#1a1a2e', '#16213e', '#0f3460'] 
          : ['#f8fafc', '#e2e8f0', '#cbd5e1']
        }
        className="absolute inset-0"
      />
      
      {/* Subtle Glass Overlay */}
      <View className={`absolute inset-0 ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
      
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Profile Header with Glass Effect */}
        <GlassCard 
          intensity={35} 
          tint="dark" 
          className="mb-6 p-6"
          radius="2xl"
        >
          <View className="items-center">
            {/* Avatar */}
            <View className="bg-orange-500/20 rounded-full p-4 mb-4">
              <Text className="text-4xl">U</Text>
            </View>
            
            {/* User Info */}
            <Text className="text-2xl font-bold text-white mb-1">
              {profile?.display_name || user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text className="text-white/70 mb-4">
              {user?.email || 'user@example.com'}
            </Text>
            
            {/* Edit Profile Button */}
            <GlassButton
              onPress={handleEditProfile}
              variant="secondary"
              size="sm"
            >
              <Text className="text-white font-medium">
                Edit Profile
              </Text>
            </GlassButton>
          </View>
        </GlassCard>

        {/* User Stats */}
        <GlassCard 
          intensity={25} 
          tint="dark" 
          className="mb-6 p-6"
          radius="xl"
        >
          <Text className="text-xl font-bold text-white mb-4">
            Your Progress
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">T</Text>
                <View>
                  <Text className="text-white font-medium">Questions Completed</Text>
                  <Text className="text-white/60 text-sm">Keep the conversations flowing</Text>
                </View>
              </View>
              <Text className="text-2xl font-bold text-orange-400">
                {userStats.questionsCompleted}
              </Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">H</Text>
                <View>
                  <Text className="text-white font-medium">Favorite Questions</Text>
                  <Text className="text-white/60 text-sm">Your saved conversations</Text>
                </View>
              </View>
              <Text className="text-2xl font-bold text-red-400">
                {userStats.favoriteQuestions}
              </Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">D</Text>
                <View>
                  <Text className="text-white font-medium">Decks Completed</Text>
                  <Text className="text-white/60 text-sm">Question categories finished</Text>
                </View>
              </View>
              <Text className="text-2xl font-bold text-blue-400">
                {userStats.decksCompleted}
              </Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Text className="text-2xl mr-3">S</Text>
                <View>
                  <Text className="text-white font-medium">Current Streak</Text>
                  <Text className="text-white/60 text-sm">Days in a row</Text>
                </View>
              </View>
              <Text className="text-2xl font-bold text-yellow-400">
                {userStats.streakDays}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Quick Actions */}
        <View className="space-y-3 mb-6">
          <GlassCard 
            intensity={20} 
            tint="dark" 
            className="p-4"
            radius="xl"
          >
            <Pressable 
              onPress={handleSettings}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-4">S</Text>
                  <View>
                    <Text className="text-white font-medium">Settings</Text>
                    <Text className="text-white/60 text-sm">Preferences and notifications</Text>
                  </View>
                </View>
                <Text className="text-white/40">→</Text>
              </View>
            </Pressable>
          </GlassCard>
          
          <GlassCard 
            intensity={20} 
            tint="dark" 
            className="p-4"
            radius="xl"
          >
            <Pressable 
              onPress={handleShareApp}
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-4">S</Text>
                  <View>
                    <Text className="text-white font-medium">Share Connect</Text>
                    <Text className="text-white/60 text-sm">Invite friends to join</Text>
                  </View>
                </View>
                <Text className="text-white/40">→</Text>
              </View>
            </Pressable>
          </GlassCard>
        </View>

        {/* Sign Out Button */}
        <GlassButton
          onPress={handleSignOut}
          variant="secondary"
          size="lg"
          className="mb-8"
        >
          <Text className="text-white font-semibold">
            Sign Out
          </Text>
        </GlassButton>

        {/* App Info */}
        <GlassCard 
          intensity={15} 
          tint="dark" 
          className="p-4 mb-8"
          radius="lg"
        >
          <View className="items-center">
            <Text className="text-white/60 text-sm mb-1">
              Connect App v1.0.0
            </Text>
            <Text className="text-white/40 text-xs">
              Made with love for meaningful conversations
            </Text>
          </View>
        </GlassCard>

        {/* Bottom spacing for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
