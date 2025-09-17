import React from 'react';
import { Tabs } from 'expo-router';
import { GlassTabBar } from '@/components/ui';
import { Text } from 'react-native';

// Icons for Connect app tabs
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>🏠</Text>
);

const DecksIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>🎯</Text>
);

const FavoritesIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>❤️</Text>
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Text style={{ color, fontSize: size }}>👤</Text>
);

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="decks"
        options={{
          title: 'Decks',
          tabBarIcon: DecksIcon,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: FavoritesIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}
