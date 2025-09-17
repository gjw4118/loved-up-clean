// Enhanced Glass Button Component
// Uses HeroUI Button as base with iOS 26 glass effects overlay

import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { Button } from 'heroui-native';
import React from 'react';
import { View } from 'react-native';

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
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
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
  radius = 'xl',
  color = 'default',
}: GlassButtonProps) {
  const handlePress = async () => {
    if (disabled || loading) return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  // Map our variants to HeroUI variants
  const heroUIVariant = variant === 'primary' ? 'solid' : 
                       variant === 'secondary' ? 'bordered' : 'ghost';

  return (
    <View className={`relative ${className}`}>
      {/* Glass Effect Overlay */}
      {isLiquidGlassAvailable() ? (
        <GlassView
          glassEffectStyle="regular"
          isInteractive={false}
          tintColor={tint === 'light' ? '#FFFFFF' : tint === 'dark' ? '#000000' : undefined}
          className="absolute inset-0 rounded-xl"
        />
      ) : (
        <BlurView
          intensity={intensity}
          tint={tint === 'system' ? 'default' : tint}
          className="absolute inset-0 rounded-xl"
        />
      )}
      
      {/* HeroUI Button */}
      <Button
        onPress={handlePress}
        disabled={disabled}
        isLoading={loading}
        size={size}
        variant={heroUIVariant}
        color={color}
        radius={radius}
        startContent={startContent}
        endContent={endContent}
        className="relative z-10 bg-transparent border-white/20"
      >
        {children}
      </Button>
    </View>
  );
}
