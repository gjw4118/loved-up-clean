// iOS 26 Glass Button Component
// Combines HeroUI Button with native BlurView for authentic iOS glass effect

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface GlassButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  intensity?: number;
  tint?: 'light' | 'dark' | 'system';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export default function GlassButton({
  children,
  onPress,
  disabled = false,
  loading = false,
  intensity = 30,
  tint = 'system',
  className = '',
  size = 'md',
  variant = 'primary',
  startContent,
  endContent,
}: GlassButtonProps) {
  const handlePress = async () => {
    if (disabled || loading) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const sizeClasses = {
    sm: 'h-10 px-4',
    md: 'h-12 px-6',
    lg: 'h-14 px-8',
  };

  const variantStyles = {
    primary: 'border-white/30',
    secondary: 'border-gray-300/30',
    ghost: 'border-transparent',
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-xl
        ${sizeClasses[size]}
        ${className}
        ${disabled ? 'opacity-50' : ''}
      `}
      style={({ pressed }) => ({
        opacity: pressed && !disabled ? 0.8 : 1,
        transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
      })}
    >
      {/* iOS 26 Glass Background */}
      <BlurView
        intensity={intensity}
        tint={tint}
        className="absolute inset-0"
      />
      
      {/* Glass Border */}
      <View className={`absolute inset-0 rounded-xl border ${variantStyles[variant]}`} />
      
      {/* Content Container */}
      <View className="relative z-10 flex-1 flex-row items-center justify-center space-x-2">
        {startContent && (
          <View>{startContent}</View>
        )}
        
        {loading ? (
          <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <View className="flex-row items-center space-x-2">
            {typeof children === 'string' ? (
              <Text className="text-white font-semibold text-base">
                {children}
              </Text>
            ) : (
              children
            )}
          </View>
        )}
        
        {endContent && (
          <View>{endContent}</View>
        )}
      </View>
    </Pressable>
  );
}
