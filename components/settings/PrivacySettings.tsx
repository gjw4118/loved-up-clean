// Privacy Settings Tab Component - Simplified version
import { GlassButton, GlassCard } from '@/components/ui';
import { useProfile } from '@/hooks/useProfile';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Switch } from 'heroui-native';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

interface PrivacySettingsProps {
  className?: string;
}

export default function PrivacySettings({ className }: PrivacySettingsProps) {
  const { updateProfile } = useProfile();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    allowQuestionSharing: true,
    analyticsOptIn: true,
    dataCollection: true,
    personalizedAds: false,
    locationTracking: false,
  });

  const handleSwitchChange = async (field: string, value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePrivacy = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setIsLoading(true);
    
    try {
      // TODO: Implement privacy settings update
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Success', 'Privacy settings updated successfully!');
    } catch (error) {
      console.error('Error updating privacy:', error);
      Alert.alert('Error', 'Failed to update privacy settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Export Data',
      'This will prepare a download of all your data including questions, answers, and preferences.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            // TODO: Implement data export
            Alert.alert('Export Started', 'Your data export will be ready shortly. You\'ll receive an email when it\'s ready.');
          }
        }
      ]
    );
  };

  return (
    <View className={`p-2 ${className || ''}`}>
      {/* Sharing Preferences */}
      <GlassCard 
        intensity={20} 
        tint="dark" 
        className="p-6 mb-4"
        radius="xl"
      >
        <Text className="text-white font-medium text-base mb-4">Sharing Preferences</Text>
        
        {/* Allow Question Sharing */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="share" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Allow Question Sharing</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Let others share questions with you
            </Text>
          </View>
          <Switch
            isSelected={formData.allowQuestionSharing}
            onValueChange={(value) => handleSwitchChange('allowQuestionSharing', value)}
          />
        </View>
      </GlassCard>

      {/* Data & Analytics */}
      <GlassCard 
        intensity={20} 
        tint="dark" 
        className="p-6 mb-4"
        radius="xl"
      >
        <Text className="text-white font-medium text-base mb-4">Data & Analytics</Text>
        
        {/* Analytics Opt-in */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="analytics" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Analytics</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Help improve the app with anonymous usage data
            </Text>
          </View>
          <Switch
            isSelected={formData.analyticsOptIn}
            onValueChange={(value) => handleSwitchChange('analyticsOptIn', value)}
          />
        </View>

        {/* Data Collection */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="server" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Data Collection</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Allow collection of app usage data
            </Text>
          </View>
          <Switch
            isSelected={formData.dataCollection}
            onValueChange={(value) => handleSwitchChange('dataCollection', value)}
          />
        </View>

        {/* Personalized Ads */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="megaphone" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Personalized Ads</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Show personalized advertisements
            </Text>
          </View>
          <Switch
            isSelected={formData.personalizedAds}
            onValueChange={(value) => handleSwitchChange('personalizedAds', value)}
          />
        </View>

        {/* Location Tracking */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <Ionicons name="location" size={16} color="white" className="mr-2" />
              <Text className="text-white font-medium">Location Tracking</Text>
            </View>
            <Text className="text-white/70 text-sm">
              Allow location-based features
            </Text>
          </View>
          <Switch
            isSelected={formData.locationTracking}
            onValueChange={(value) => handleSwitchChange('locationTracking', value)}
          />
        </View>
      </GlassCard>

      {/* Data Management */}
      <GlassCard 
        intensity={20} 
        tint="dark" 
        className="p-6 mb-6"
        radius="xl"
      >
        <Text className="text-white font-medium text-base mb-4">Data Management</Text>
        
        <GlassButton
          onPress={handleExportData}
          variant="secondary"
          size="md"
          className="w-full"
        >
          <Text className="text-white font-medium">
            Export My Data
          </Text>
        </GlassButton>
      </GlassCard>

      {/* Save Button */}
      <GlassButton
        onPress={handleSavePrivacy}
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        <Text className="text-white font-semibold">
          {isLoading ? 'Saving...' : 'Update Privacy Settings'}
        </Text>
      </GlassButton>
    </View>
  );
}