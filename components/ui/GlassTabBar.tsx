// iOS 26 Glass Tab Bar Component
// Native iOS tab bar with glass effect for Expo Router tabs

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface GlassTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function GlassTabBar({ state, descriptors, navigation }: GlassTabBarProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0">
      {/* iOS 26 Glass Background */}
      <BlurView
        intensity={40}
        tint="system"
        className="absolute inset-0"
      />
      
      {/* Top Border */}
      <View className="absolute top-0 left-0 right-0 h-px bg-white/10" />
      
      {/* Tab Items Container */}
      <View className="flex-row h-20 pb-6 pt-2 px-4">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : options.title !== undefined 
            ? options.title 
            : route.name;

          const isFocused = state.index === index;

          const onPress = async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              {/* Active Indicator */}
              {isFocused && (
                <View className="absolute -top-1 w-8 h-1 bg-blue-500 rounded-full" />
              )}
              
              {/* Icon */}
              <View className="mb-1">
                {options.tabBarIcon?.({
                  focused: isFocused,
                  color: isFocused ? '#007AFF' : '#8E8E93',
                  size: 24,
                })}
              </View>
              
              {/* Label */}
              <Text 
                className={`text-xs font-medium ${
                  isFocused ? 'text-blue-500' : 'text-gray-500'
                }`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
