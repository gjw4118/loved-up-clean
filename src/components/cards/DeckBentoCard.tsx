// Premium Bento Grid Card Component
// HeroUI-inspired sophisticated card design with no emojis

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface DeckBentoCardProps {
  deck: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    gradient: string[];
    estimatedQuestions?: number;
    question_count?: number;
    isPremium?: boolean;
    image?: any;
  };
  onPress: () => void;
  size: 'small' | 'medium' | 'large';
  isDark: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DeckBentoCard({ deck, onPress, size, isDark }: DeckBentoCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  // Size configurations for bento grid - increased for full-screen effect
  const getSizeConfig = () => {
    switch (size) {
      case 'large':
        return { height: 320, padding: 24 };
      case 'medium':
        return { height: 220, padding: 20 };
      case 'small':
        return { height: 180, padding: 16 };
    }
  };

  const { height, padding } = getSizeConfig();
  const questionCount = deck.question_count || deck.estimatedQuestions || 0;

  return (
    <AnimatedPressable
      style={[
        {
          height,
          borderRadius: 24,
          overflow: 'hidden',
        },
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View
        style={{
          flex: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        {deck.image ? (
          <ImageBackground
            source={deck.image}
            style={{ flex: 1 }}
            resizeMode="cover"
          >
            {/* Gradient Overlay */}
            <LinearGradient
              colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)']}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />

            {/* Premium Badge */}
            {deck.isPremium && (
              <View
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                  borderRadius: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    color: '#000',
                    fontSize: 10,
                    fontWeight: '800',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Premium
                </Text>
              </View>
            )}

            {/* Content */}
            <View
              style={{
                flex: 1,
                padding,
                justifyContent: 'flex-end',
              }}
            >
              {/* Text Content */}
              <View>
                <Text
                  style={{
                    fontSize: size === 'large' ? 26 : size === 'medium' ? 22 : 18,
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: 6,
                    letterSpacing: 0.3,
                  }}
                  numberOfLines={1}
                >
                  {deck.name}
                </Text>
                
                {size !== 'small' && (
                  <Text
                    style={{
                      fontSize: size === 'large' ? 14 : 13,
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: 10,
                      lineHeight: 20,
                    }}
                    numberOfLines={size === 'large' ? 2 : 1}
                  >
                    {deck.description}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: '#ffffff',
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {questionCount} Questions
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        ) : (
          // Fallback gradient background
          <LinearGradient
            colors={deck.gradient || ['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          >
            {/* Same content structure as above */}
            <View
              style={{
                flex: 1,
                padding,
                justifyContent: 'flex-end',
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: size === 'large' ? 26 : size === 'medium' ? 22 : 18,
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: 6,
                    letterSpacing: 0.3,
                  }}
                  numberOfLines={1}
                >
                  {deck.name}
                </Text>
                
                {size !== 'small' && (
                  <Text
                    style={{
                      fontSize: size === 'large' ? 14 : 13,
                      color: 'rgba(255, 255, 255, 0.85)',
                      marginBottom: 10,
                      lineHeight: 20,
                    }}
                    numberOfLines={size === 'large' ? 2 : 1}
                  >
                    {deck.description}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 10,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: '#ffffff',
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {questionCount} Questions
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        )}
      </View>
    </AnimatedPressable>
  );
}

