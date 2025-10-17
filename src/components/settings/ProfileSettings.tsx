// Profile Settings Component
// Minimal Apple-compliant profile management

import { useAuth } from '@/lib/auth/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { Avatar } from 'heroui-native';
import React from 'react';
import { Text, View } from 'react-native';

interface ProfileSettingsProps {
  className?: string;
}

export default function ProfileSettings({ className }: ProfileSettingsProps) {
  const { user, profile } = useAuth();
  const { isDark } = useTheme();

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <View className={`p-2 ${className || ''}`}>
      {/* Profile Header */}
      <View 
        className="p-6 mb-6 rounded-xl"
        style={{
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        }}
      >
        <Text className="text-gray-900 dark:text-white text-lg font-semibold mb-2">Profile</Text>
        <Text className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          Your profile information
        </Text>
        
        {/* Avatar Section */}
        <View className="flex-row items-center mb-6">
          <Avatar
            size="lg"
            src={profile?.avatar_url}
            fallback={
              <View className="bg-orange-500 rounded-full w-16 h-16 items-center justify-center">
                <Text className="text-white text-xl font-bold">
                  {getInitials(profile?.first_name, profile?.last_name, user?.email)}
                </Text>
              </View>
            }
          />
          
          <View className="ml-4 flex-1">
            <Text className="text-gray-900 dark:text-white font-medium text-base">
              {getDisplayName()}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300 text-sm">
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>

        {/* Profile Info */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-900 dark:text-white font-medium text-sm mb-1">First Name</Text>
            <Text className="text-gray-600 dark:text-gray-300 text-base">
              {profile?.first_name || 'Not set'}
            </Text>
          </View>
          
          <View>
            <Text className="text-gray-900 dark:text-white font-medium text-sm mb-1">Last Name</Text>
            <Text className="text-gray-600 dark:text-gray-300 text-base">
              {profile?.last_name || 'Not set'}
            </Text>
          </View>
          
          <View>
            <Text className="text-gray-900 dark:text-white font-medium text-sm mb-1">Email</Text>
            <Text className="text-gray-600 dark:text-gray-300 text-base">
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}