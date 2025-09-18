// Settings Screen - Minimal Apple Compliant Design
// Only essential settings for App Store compliance

import ProfileSettings from '@/components/settings/ProfileSettings';
import { LinearGradient, StatusBar } from '@/components/ui';
import { Tabs } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { theme, isDark } = useTheme();

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Theme-aware Dynamic Gradient Background */}
      <LinearGradient
        colors={isDark ? ['#1a1a1a', '#2d2d2d'] : ['#f8fafc', '#e2e8f0', '#cbd5e1']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-8 pb-6">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Settings
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 text-sm">
            Manage your profile and app preferences.
          </Text>
        </View>

        {/* Settings Content */}
        <View className="px-6 pb-8">
          <Tabs defaultValue="profile" className="w-full">
            <Tabs.List className="w-full mb-6">
              <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
              <Tabs.Trigger value="preferences">Preferences</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="profile" className="pt-0">
              <ProfileSettings />
            </Tabs.Content>

            <Tabs.Content value="preferences" className="pt-0">
              <View className="space-y-6">
                {/* Theme Selection */}
                <View>
                  <Text className="text-gray-900 dark:text-white text-lg font-semibold mb-4">Appearance</Text>
                  <View 
                    className="p-6 rounded-xl"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      borderWidth: 1,
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Text className="text-gray-900 dark:text-white font-medium text-base mb-2">Theme</Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm">
                      Current theme: {isDark ? 'Dark' : 'Light'}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                      Theme follows your device settings
                    </Text>
                  </View>
                </View>

                {/* Notifications */}
                <View>
                  <Text className="text-gray-900 dark:text-white text-lg font-semibold mb-4">Notifications</Text>
                  <View 
                    className="p-6 rounded-xl"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      borderWidth: 1,
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Text className="text-gray-900 dark:text-white font-medium text-base mb-2">Push Notifications</Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm">
                      Manage notifications in your device Settings
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                      Go to Settings → Notifications → GoDeeper
                    </Text>
                  </View>
                </View>

                {/* Privacy */}
                <View>
                  <Text className="text-gray-900 dark:text-white text-lg font-semibold mb-4">Privacy</Text>
                  <View 
                    className="p-6 rounded-xl"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      borderWidth: 1,
                      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Text className="text-gray-900 dark:text-white font-medium text-base mb-2">Data Privacy</Text>
                    <Text className="text-gray-600 dark:text-gray-300 text-sm">
                      We respect your privacy and only collect essential data
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                      See our Privacy Policy for details
                    </Text>
                  </View>
                </View>
              </View>
            </Tabs.Content>
          </Tabs>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
