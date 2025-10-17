import { useTheme } from '@/lib/contexts/ThemeContext';
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
        <Icon sf={{ default: 'target', selected: 'target.fill' }} />
        <Label>Decks</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="us">
        <Icon sf={{ default: 'bubble.left.and.bubble.right', selected: 'bubble.left.and.bubble.right.fill' }} />
        <Label>Us</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="learn">
        <Icon sf={{ default: 'book', selected: 'book.fill' }} />
        <Label>Learn</Label>
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} />
        <Label>You</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}