import { Button } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GoogleProviderButtonProps } from '../../types/auth';

export function GoogleProviderButton({
  onPress,
  loading = false,
  disabled = false,
  className = '',
}: GoogleProviderButtonProps) {
  const { signInWithGoogle } = useAuth();

  const handlePress = onPress || signInWithGoogle;

  return (
    <Button
      className="w-full"
      size="lg"
      variant="bordered"
      color="default"
      onPress={handlePress}
      disabled={disabled}
      isLoading={loading}
      startContent={<Ionicons name="logo-google" size={20} color="#3c4043" />}
    >
      {loading ? 'Connecting...' : 'Connect with Google'}
    </Button>
  );
}

