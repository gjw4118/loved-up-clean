// Account Settings Tab Component - Simplified version
import { GlassButton, GlassCard } from '@/components/ui';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/lib/auth/AuthContext';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

interface AccountSettingsProps {
  className?: string;
}

export default function AccountSettings({ className }: AccountSettingsProps) {
  const { user, profile } = useAuth();
  const { updateProfile } = useProfile();
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveAccount = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!profile) {
      Alert.alert('Error', 'Profile not found. Please try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement account settings update
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Success', 'Account settings updated successfully!');
    } catch (error) {
      console.error('Error updating account:', error);
      Alert.alert('Error', 'Failed to update account settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className={`p-2 ${className || ''}`}>
      {/* Email Address */}
      <GlassCard 
        intensity={20} 
        tint="dark" 
        className="p-6 mb-4"
        radius="xl"
      >
        <Text className="text-white font-medium text-base mb-2">Email Address</Text>
        <Text className="text-white/70 text-sm mb-4">
          The email address associated with your account
        </Text>
        <View className="bg-white/5 rounded-lg p-3 border border-white/10">
          <Text className="text-white/70 text-base">
            {user?.email || 'user@example.com'}
          </Text>
        </View>
        <Text className="text-white/50 text-xs mt-2">
          Email cannot be changed. Contact support if needed.
        </Text>
      </GlassCard>

      {/* Account Info */}
      <GlassCard 
        intensity={20} 
        tint="dark" 
        className="p-6 mb-6"
        radius="xl"
      >
        <Text className="text-white font-medium text-base mb-4">Account Information</Text>
        <Text className="text-white/70 text-sm mb-4">
          Account settings and preferences will be available soon.
        </Text>
      </GlassCard>

      {/* Save Button */}
      <GlassButton
        onPress={handleSaveAccount}
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        <Text className="text-white font-semibold">
          {isLoading ? 'Saving...' : 'Update Account'}
        </Text>
      </GlassButton>
    </View>
  );
}