import { useTheme } from '@/hooks/useTheme';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  const { isDark } = useTheme();
  
  return (
    <NativeTabs
      backgroundColor={isDark ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)"}
      tintColor="#FF6B35"
      iconColor={isDark ? "#9CA3AF" : "#6B7280"}
    >
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'target', selected: 'target' }} />
        <Label>Decks</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: 'gear', selected: 'gear.fill' }} />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}