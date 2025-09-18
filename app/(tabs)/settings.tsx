// Settings Tab - Tabbed interface for all settings sections
// Adapted from HEROUI PRO template for React Native with glass morphism design

import AccountSettings from '@/components/settings/AccountSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import ProfileSettings from '@/components/settings/ProfileSettings';
import { LinearGradient, StatusBar } from '@/components/ui';
import { Tabs } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function SettingsTab() {
  const { theme, isDark } = useTheme();

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
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </Text>
          <Text className="text-gray-600 dark:text-white/70 text-base">
            Customize your Connect experience
          </Text>
        </View>

        {/* Settings Content */}
        <View className="px-4 pb-8">
          <Tabs defaultValue="profile" className="w-full">
            <Tabs.List className="grid w-full grid-cols-5">
              <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
              <Tabs.Trigger value="account">Account</Tabs.Trigger>
              <Tabs.Trigger value="appearance">Appearance</Tabs.Trigger>
              <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
              <Tabs.Trigger value="privacy">Privacy</Tabs.Trigger>
            </Tabs.List>
            
            <Tabs.Content value="profile" className="pt-6">
              <ProfileSettings />
            </Tabs.Content>
            
            <Tabs.Content value="account" className="pt-6">
              <AccountSettings />
            </Tabs.Content>
            
            <Tabs.Content value="appearance" className="pt-6">
              <AppearanceSettings />
            </Tabs.Content>
            
            <Tabs.Content value="notifications" className="pt-6">
              <NotificationSettings />
            </Tabs.Content>
            
            <Tabs.Content value="privacy" className="pt-6">
              <PrivacySettings />
            </Tabs.Content>
          </Tabs>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
