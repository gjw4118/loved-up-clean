// Notification Settings Tab Component - Simplified version
import { GlassButton, GlassCard } from '@/components/ui';
import { useProfile } from '@/hooks/useProfile';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Switch } from 'heroui-native';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

interface NotificationSettingsProps {
  className?: string;
}

export default function NotificationSettings({ className }: NotificationSettingsProps) {
  const { updateProfile } = useProfile();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    dailyReminder: true,
    weeklySummary: true,
    newQuestions: true,
    sharingNotifications: true,
    pushNotifications: true,
    emailNotifications: false,
  });

  const handleSwitchChange = async (field: string, value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveNotifications = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setIsLoading(true);
    
    try {
      // TODO: Implement notification settings update
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Success', 'Notification settings updated successfully!');
    } catch (error) {
      console.error('Error updating notifications:', error);
      Alert.alert('Error', 'Failed to update notification settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className={`p-2 ${className || ''}`}>
      {/* App Notifications */}
      <GlassCard 
        intensity={20} 
        tint="dark" 
        className="p-6 mb-4"
        radius="xl"
      >
        <Text className="text-white font-medium text-base mb-4">App Notifications</Text>
        
        {/* Daily Reminder */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="alarm" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Daily Reminder</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Get reminded to have meaningful conversations
            </Text>
          </View>
          <Switch
            isSelected={formData.dailyReminder}
            onValueChange={(value) => handleSwitchChange('dailyReminder', value)}
          />
        </View>

        {/* Weekly Summary */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Weekly Summary</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Receive a summary of your weekly progress
            </Text>
          </View>
          <Switch
            isSelected={formData.weeklySummary}
            onValueChange={(value) => handleSwitchChange('weeklySummary', value)}
          />
        </View>

        {/* New Questions */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="add-circle" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">New Questions</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Get notified when new questions are added
            </Text>
          </View>
          <Switch
            isSelected={formData.newQuestions}
            onValueChange={(value) => handleSwitchChange('newQuestions', value)}
          />
        </View>

        {/* Sharing Notifications */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="share" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Sharing Notifications</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Get notified when someone shares questions with you
            </Text>
          </View>
          <Switch
            isSelected={formData.sharingNotifications}
            onValueChange={(value) => handleSwitchChange('sharingNotifications', value)}
          />
        </View>
      </GlassCard>

      {/* Notification Methods */}
      <GlassCard 
        intensity={20} 
        tint="dark" 
        className="p-6 mb-6"
        radius="xl"
      >
        <Text className="text-white font-medium text-base mb-4">Notification Methods</Text>
        
        {/* Push Notifications */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="phone-portrait" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Push Notifications</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Receive notifications on your device
            </Text>
          </View>
          <Switch
            isSelected={formData.pushNotifications}
            onValueChange={(value) => handleSwitchChange('pushNotifications', value)}
          />
        </View>

        {/* Email Notifications */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="mail" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Email Notifications</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Receive notifications via email
            </Text>
          </View>
          <Switch
            isSelected={formData.emailNotifications}
            onValueChange={(value) => handleSwitchChange('emailNotifications', value)}
          />
        </View>
      </GlassCard>

      {/* Save Button */}
      <GlassButton
        onPress={handleSaveNotifications}
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        <Text className="text-white font-semibold">
          {isLoading ? 'Saving...' : 'Update Notifications'}
        </Text>
      </GlassButton>
    </View>
  );
}