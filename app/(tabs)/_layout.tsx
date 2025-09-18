import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  return (
    <NativeTabs
      backgroundColor="rgba(0,0,0,0.8)"
      tintColor="#FF6B35"
      iconColor="#9CA3AF"
    >
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'target', selected: 'target' }} />
        <Label>Decks</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}