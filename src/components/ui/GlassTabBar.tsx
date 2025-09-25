// iOS 26 Glass Tab Bar Component
// Native iOS tab bar with glass effect for Expo Router tabs

import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { BlurView } from 'expo-blur'; // Fallback for older iOS versions
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface GlassTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function GlassTabBar({ state, descriptors, navigation }: GlassTabBarProps) {
  const useNativeGlass = isLiquidGlassAvailable();

  if (useNativeGlass) {
    return (
      <GlassView
        glassEffectStyle="regular"
        isInteractive={false}
        tintColor="#000000"
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 80,
          paddingBottom: 24,
          paddingTop: 8,
          paddingHorizontal: 16,
        }}
      >
        {/* Tab Items Container */}
        <View className="flex-row h-full">
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
                  <View className="absolute -top-1 w-8 h-1 bg-orange-500 rounded-full" />
                )}
                
                {/* Icon */}
                <View className="mb-1">
                  {options.tabBarIcon?.({
                    focused: isFocused,
                    color: isFocused ? '#FF6B35' : '#9CA3AF',
                    size: 24,
                  })}
                </View>
                
                {/* Label */}
                <Text 
                  className={`text-xs font-medium ${
                    isFocused ? 'text-orange-500' : 'text-gray-400'
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GlassView>
    );
  }

  // Fallback to BlurView for older iOS versions
  return (
    <View className="absolute bottom-0 left-0 right-0">
      {/* iOS 26 Glass Background */}
      <BlurView
        intensity={40}
        tint="default"
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
                <View className="absolute -top-1 w-8 h-1 bg-orange-500 rounded-full" />
              )}
              
              {/* Icon */}
              <View className="mb-1">
                {options.tabBarIcon?.({
                  focused: isFocused,
                  color: isFocused ? '#FF6B35' : '#9CA3AF',
                  size: 24,
                })}
              </View>
              
              {/* Label */}
              <Text 
                className={`text-xs font-medium ${
                  isFocused ? 'text-orange-500' : 'text-gray-400'
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
