// Enhanced Glass Card Component
// Uses HeroUI Card as base with iOS 26 glass effects overlay

import { BlurView } from 'expo-blur'; // Fallback for older iOS versions
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Card } from 'heroui-native';
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  intensity?: number;
  tint?: 'light' | 'dark' | 'system';
  className?: string;
  style?: ViewStyle;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  glassEffectStyle?: 'regular' | 'clear';
  isInteractive?: boolean;
  isPressable?: boolean;
  isHoverable?: boolean;
  onPress?: () => void;
}

export default function GlassCard({
  children,
  header,
  footer,
  intensity = 40,
  tint = 'system',
  className = '',
  style,
  radius = 'xl',
  shadow = 'lg',
  glassEffectStyle = 'regular',
  isInteractive = false,
  isPressable = false,
  isHoverable = false,
  onPress,
}: GlassCardProps) {
  // Use native glass effect if available, fallback to BlurView
  const useNativeGlass = isLiquidGlassAvailable();

  return (
    <View className={`relative ${className}`} style={style}>
      {/* Glass Effect Overlay */}
      {useNativeGlass ? (
        <GlassView
          glassEffectStyle={glassEffectStyle}
          isInteractive={isInteractive}
          tintColor={tint === 'light' ? '#FFFFFF' : tint === 'dark' ? '#000000' : undefined}
          className="absolute inset-0"
          style={{
            borderRadius: radius === 'xl' ? 16 : radius === 'lg' ? 12 : 8,
          }}
        />
      ) : (
        <BlurView
          intensity={intensity}
          tint={tint === 'system' ? 'default' : tint}
          className="absolute inset-0"
          style={{
            borderRadius: radius === 'xl' ? 16 : radius === 'lg' ? 12 : 8,
          }}
        />
      )}
      
      {/* Glass Border Effect */}
      <View
        className="absolute inset-0 border border-white/20"
        style={{
          borderRadius: radius === 'xl' ? 16 : radius === 'lg' ? 12 : 8,
        }}
      />

      {/* HeroUI Card */}
      <Card
        className="relative z-10 bg-transparent border-0"
        radius={radius}
        shadow={shadow}
        isPressable={isPressable}
        isHoverable={isHoverable}
        onPress={onPress}
      >
        {header && (
          <Card.Header className="bg-transparent text-foreground">
            {header}
          </Card.Header>
        )}
        
        <Card.Body className="bg-transparent text-foreground">
          {children}
        </Card.Body>
        
        {footer && (
          <Card.Footer className="bg-transparent text-foreground">
            {footer}
          </Card.Footer>
        )}
      </Card>
    </View>
  );
}
