import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor="rgba(0,0,0,0.8)"
      tintColor="#FF6B35"
      iconColor="#9CA3AF"
      blurEffect="systemMaterialDark"
    >
      <NativeTabs.Trigger name="index">
        <Icon sf="house" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="decks">
        <Icon sf="target" />
        <Label>Decks</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="favorites">
        <Icon sf="heart" />
        <Label>Favorites</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="profile">
        <Icon sf="person" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
