// Appearance Settings Tab Component - Simplified version
import { GlassButton, GlassCard } from '@/components/ui';
import { useColorScheme } from '@/components/useColorScheme';
import { useProfile } from '@/hooks/useProfile';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Switch } from 'heroui-native';
import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';

interface AppearanceSettingsProps {
  className?: string;
}

export default function AppearanceSettings({ className }: AppearanceSettingsProps) {
  const colorScheme = useColorScheme();
  const { updateProfile } = useProfile();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    translucentUI: true,
    hapticFeedback: true,
    animations: true,
  });

  const handleSwitchChange = async (field: string, value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAppearance = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setIsLoading(true);
    
    try {
      // TODO: Implement appearance settings update
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Success', 'Appearance settings updated successfully!');
    } catch (error) {
      console.error('Error updating appearance:', error);
      Alert.alert('Error', 'Failed to update appearance settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className={`p-2 ${className || ''}`}>
      {/* Theme Selection */}
      <GlassCard 
        intensity={20} 
        tint="dark" 
        className="p-6 mb-4"
        radius="xl"
      >
        <Text className="text-white font-medium text-base mb-2">Theme</Text>
        <Text className="text-white/70 text-sm mb-4">
          Current theme: {colorScheme || 'auto'}
        </Text>
        
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons 
              name={colorScheme === 'dark' ? 'moon' : 'sunny'} 
              size={20} 
              color="white" 
              className="mr-3"
            />
            <Text className="text-white font-medium">
              {colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </Text>
          </View>
          <Text className="text-white/60 text-sm">
            Auto
          </Text>
        </View>
      </GlassCard>

      {/* UI Preferences */}
      <GlassCard 
        intensity={20} 
        tint="dark" 
        className="p-6 mb-4"
        radius="xl"
      >
        <Text className="text-white font-medium text-base mb-4">UI Preferences</Text>
        
        {/* Translucent UI */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-white font-medium">Translucent UI</Text>
            <Text className="text-white/70 text-sm">
              Use transparency in UI elements like cards and modals
            </Text>
          </View>
          <Switch
            isSelected={formData.translucentUI}
            onValueChange={(value) => handleSwitchChange('translucentUI', value)}
          />
        </View>

        {/* Haptic Feedback */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-white font-medium">Haptic Feedback</Text>
            <Text className="text-white/70 text-sm">
              Feel vibrations when interacting with the app
            </Text>
          </View>
          <Switch
            isSelected={formData.hapticFeedback}
            onValueChange={(value) => handleSwitchChange('hapticFeedback', value)}
          />
        </View>

        {/* Animations */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white font-medium">Animations</Text>
            <Text className="text-white/70 text-sm">
              Enable smooth transitions and animations
            </Text>
          </View>
          <Switch
            isSelected={formData.animations}
            onValueChange={(value) => handleSwitchChange('animations', value)}
          />
        </View>
      </GlassCard>

      {/* Save Button */}
      <GlassButton
        onPress={handleSaveAppearance}
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        <Text className="text-white font-semibold">
          {isLoading ? 'Saving...' : 'Update Appearance'}
        </Text>
      </GlassButton>
    </View>
  );
}