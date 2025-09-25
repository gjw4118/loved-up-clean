import { Platform, Text, View } from 'react-native';
import React from 'react';
import { Button } from 'heroui-native';
import { useAuth } from '@/lib/auth/AuthContext';
import { AppleProviderButtonProps } from '@/types/auth';
import * as Haptics from 'expo-haptics';

export function AppleProviderButton({
  onPress,
  loading = false,
  disabled = false,
  className = '',
}: AppleProviderButtonProps) {
  const { user } = useAuth();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    } else {
      // Will be handled by the auth screen
    }
  };

  if (Platform.OS === 'ios')
    return (
      <Button
        onPress={handlePress}
        disabled={disabled || loading}
        isLoading={loading}
        className="w-full bg-black"
        size="lg"
        radius="lg"
        startContent={
          <View>
            <Text className="text-2xl">🍎</Text>
          </View>
        }
      >
        <Text className="text-white font-semibold text-lg">
          {loading ? 'Connecting...' : 'Continue with Apple'}
        </Text>
      </Button>
    );
  return null; // Apple Sign In is only available on iOS
}

