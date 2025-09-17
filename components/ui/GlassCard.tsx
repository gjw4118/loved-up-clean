// iOS 26 Glass Card Component
// Combines HeroUI Card with native BlurView for authentic iOS glass effect

import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Card, CardBody, CardHeader, CardFooter } from 'heroui-native';
import { BlurView } from 'expo-blur';

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
}: GlassCardProps) {
  return (
    <Card
      className={`bg-transparent border-0 ${className}`}
      radius={radius}
      shadow={shadow}
      style={style}
    >
      {/* iOS 26 Glass Background */}
      <BlurView
        intensity={intensity}
        tint={tint}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: radius === 'xl' ? 16 : radius === 'lg' ? 12 : 8,
        }}
      />
      
      {/* Glass Border Effect */}
      <View
        className="absolute inset-0 rounded-xl border border-white/20"
        style={{
          borderRadius: radius === 'xl' ? 16 : radius === 'lg' ? 12 : 8,
        }}
      />

      {/* Content */}
      {header && (
        <CardHeader className="relative z-10 bg-transparent">
          {header}
        </CardHeader>
      )}
      
      <CardBody className="relative z-10 bg-transparent">
        {children}
      </CardBody>
      
      {footer && (
        <CardFooter className="relative z-10 bg-transparent">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
