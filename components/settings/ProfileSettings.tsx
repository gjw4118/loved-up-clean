// Profile Settings Tab Component
// Adapted from HEROUI PRO template for React Native with glass morphism design

import { GlassButton, GlassCard } from '@/components/ui';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/lib/auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from 'heroui-native';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

interface ProfileSettingsProps {
  className?: string;
}

export default function ProfileSettings({ className }: ProfileSettingsProps) {
  const { user, profile } = useAuth();
  const { updateProfile } = useProfile();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
  });

  const handleAvatarPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Alert.alert(
      'Change Avatar',
      'Choose how you want to update your profile picture',
      [
        { text: 'Camera', onPress: () => pickImage('camera') },
        { text: 'Photo Library', onPress: () => pickImage('library') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      const permissionResult = source === 'camera' 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera/photo library is required.');
        return;
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });

      if (!result.canceled && result.assets[0]) {
        // TODO: Upload image to Supabase storage and update profile
        console.log('Image selected:', result.assets[0].uri);
        Alert.alert('Success', 'Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    }
  };

  const handleSaveProfile = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!profile) {
      Alert.alert('Error', 'Profile not found. Please try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      await updateProfile({
        display_name: formData.display_name,
      });
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <View className={`p-2 ${className || ''}`}>
      {/* Profile Header */}
      <GlassCard 
        intensity={25} 
        tint="dark" 
        className="p-6 mb-6"
        radius="xl"
      >
        <Text className="text-white text-lg font-semibold mb-2">Profile</Text>
        <Text className="text-white/70 text-sm mb-6">
          This displays your public profile information
        </Text>
        
        {/* Avatar Section */}
        <View className="flex-row items-center mb-6">
          <Pressable onPress={handleAvatarPress}>
            <View className="relative">
              <Avatar
                size="lg"
                src={profile?.avatar_url}
                fallback={
                  <View className="bg-orange-500/20 rounded-full w-16 h-16 items-center justify-center">
                    <Text className="text-white text-xl font-bold">
                      {getInitials(formData.display_name, user?.email)}
                    </Text>
                  </View>
                }
              />
              <View className="absolute -bottom-1 -right-1 bg-white/20 rounded-full p-1">
                <Ionicons name="camera" size={12} color="white" />
              </View>
            </View>
          </Pressable>
          
          <View className="ml-4 flex-1">
            <Text className="text-white font-medium text-base">
              {formData.display_name || user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text className="text-white/60 text-sm">
              {user?.email || 'user@example.com'}
            </Text>
            <Text className="text-white/50 text-xs mt-1">
              Tap avatar to change photo
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Display Name */}
      <GlassCard 
        intensity={20} 
        tint="dark" 
        className="p-6 mb-4"
        radius="xl"
      >
        <Text className="text-white font-medium text-base mb-2">Display Name</Text>
        <Text className="text-white/70 text-sm mb-4">
          How your name appears to others
        </Text>
        <View className="bg-white/10 rounded-lg p-3 border border-white/20">
          <Text className="text-white text-base">
            {formData.display_name || 'Enter your display name'}
          </Text>
        </View>
      </GlassCard>

      {/* Save Button */}
      <GlassButton
        onPress={handleSaveProfile}
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
      >
        <Text className="text-white font-semibold">
          {isLoading ? 'Saving...' : 'Update Profile'}
        </Text>
      </GlassButton>
    </View>
  );
}