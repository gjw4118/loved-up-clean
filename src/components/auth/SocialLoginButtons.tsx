import React from 'react';
import { View } from 'react-native';
import { GoogleProviderButton } from './googleProviderButton';
import { AppleProviderButton } from './appleProviderButton';

export function SocialLoginButtons() {
  return (
    <View style={{ gap: 12 }}>
      {/* Google Sign-In temporarily disabled until credentials are configured */}
      {/* <GoogleProviderButton /> */}
      <AppleProviderButton />
    </View>
  );
}
