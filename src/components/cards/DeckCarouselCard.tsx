// Deck Carousel Card Component
// HeroUI-inspired image-based card for horizontal carousel

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ImageBackground, Pressable, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface DeckCarouselCardProps {
  deck: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    gradient: string[];
    estimatedQuestions: number;
    isPremium?: boolean;
    image: any;
  };
  onPress: () => void;
  isActive?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function DeckCarouselCard({ deck, onPress, isActive = false }: DeckCarouselCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 150 });
    opacity.value = withSpring(0.9, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const cardWidth = screenWidth * 0.85;
  const cardHeight = Math.min(screenWidth * 0.6, 500);

  return (
    <AnimatedPressable
      style={[
        {
          width: cardWidth,
          height: cardHeight,
          marginHorizontal: 10,
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
          borderRadius: 24,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 15,
        }}
      >
        <ImageBackground
          source={deck.image}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          {/* Gradient Overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
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
                top: 20,
                right: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 12,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontSize: 11,
                  fontWeight: '800',
                  letterSpacing: 1.2,
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
              justifyContent: 'space-between',
              padding: 24,
            }}
          >
            {/* Top Section - Icon */}
            <View
              style={{
                alignItems: 'center',
                marginTop: 20,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: '800',
                    color: '#ffffff',
                    letterSpacing: 2,
                    textShadowColor: 'rgba(0, 0, 0, 0.5)',
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}
                >
                  {deck.icon}
                </Text>
              </View>
            </View>

            {/* Bottom Section - Text */}
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: 20,
                padding: 24,
                backdropFilter: 'blur(20px)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
              }}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  color: '#ffffff',
                  textAlign: 'center',
                  marginBottom: 12,
                  textShadowColor: 'rgba(0, 0, 0, 0.8)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 6,
                  letterSpacing: 0.5,
                }}
              >
                {deck.name}
              </Text>
              
              <Text
                style={{
                  fontSize: 15,
                  color: 'rgba(255, 255, 255, 0.85)',
                  textAlign: 'center',
                  marginBottom: 16,
                  lineHeight: 22,
                  fontWeight: '400',
                  letterSpacing: 0.2,
                }}
              >
                {deck.description}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 12,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: '#ffffff',
                    textShadowColor: 'rgba(0, 0, 0, 0.5)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                    letterSpacing: 0.5,
                  }}
                >
                  {deck.estimatedQuestions} QUESTIONS
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </AnimatedPressable>
  );
}
