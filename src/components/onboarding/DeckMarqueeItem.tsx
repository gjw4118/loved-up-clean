import { getDeckColor } from "@/constants/Colors";
import { QuestionDeck } from "@/types/questions";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, memo } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Animated, {
    FadeIn,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

const screenWidth = Dimensions.get("screen").width;
export const _itemWidth = screenWidth * 0.6;

// Deck-specific images
const getDeckImage = (category: string) => {
  const images: Record<string, any> = {
    friends: require('../../../assets/images/onboarding/friends.jpg'),
    family: require('../../../assets/images/onboarding/family.jpg'),
    dating: require('../../../assets/images/onboarding/dating.jpg'),
    growing: require('../../../assets/images/onboarding/growing.jpg'),
    work: require('../../../assets/images/onboarding/work.jpg'),
    professional: require('../../../assets/images/onboarding/work.jpg'),
    spice: require('../../../assets/images/onboarding/spicy.jpg'),
    lovers: require('../../../assets/images/onboarding/spicy.jpg'),
    romantic: require('../../../assets/images/onboarding/dating.jpg'),
  };
  return images[category.toLowerCase()] || images.friends;
};

type Props = {
  index: number;
  deck: QuestionDeck;
  scrollOffsetX: SharedValue<number>;
  allItemsWidth: number;
};

const DeckMarqueeItemComponent: FC<Props> = ({ index, deck, scrollOffsetX, allItemsWidth }) => {
  const deckColors = getDeckColor(deck.category);
  const deckImage = getDeckImage(deck.category);

  const shift = (allItemsWidth - screenWidth) / 2;
  const initialLeft = index * _itemWidth - shift;

  const rContainerStyle = useAnimatedStyle(() => {
    const normalizedOffset =
      ((scrollOffsetX.value % allItemsWidth) + allItemsWidth) % allItemsWidth;
    const left = ((initialLeft - normalizedOffset) % allItemsWidth) + shift;

    const rotation = interpolate(left, [0, screenWidth - _itemWidth], [-0.6, 0.6]);
    const translateY = interpolate(
      left,
      [0, (screenWidth - _itemWidth) / 2, screenWidth - _itemWidth],
      [1, -0.5, 1]
    );

    return {
      left,
      transform: [{ rotateZ: `${rotation}deg` }, { translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        rContainerStyle,
        {
          position: 'absolute',
          height: '100%',
          padding: 8,
          width: _itemWidth,
          transformOrigin: "bottom",
        }
      ]}
    >
      <View style={{ flex: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 }}>
        <View style={{ flex: 1, borderRadius: 24, overflow: 'hidden' }}>
          {/* Base card image - sharp and clear */}
          <Image 
            source={deckImage}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          
          {/* Deck color tint overlay - subtle */}
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: deckColors.primary,
              opacity: 0.15,
            }}
          />
          
          {/* White gradient fade from bottom - lower third */}
          <LinearGradient
            colors={["transparent", "rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.6)"]}
            locations={[0, 0.7, 1]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '35%',
            }}
          />
          
          {/* Glassmorphism effect overlay - bottom 60% */}
          <Animated.View
            entering={FadeIn}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100%',
            }}
          >
            <MaskedView
              maskElement={
                <LinearGradient
                  locations={[0, 0.4, 0.7, 1]}
                  colors={["transparent", "transparent", "black", "black"]}
                  style={StyleSheet.absoluteFillObject}
                />
              }
              style={StyleSheet.absoluteFillObject}
            >
              {/* Duplicate image for blur */}
              <Image 
                source={deckImage}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
              {/* iOS-style blur */}
              <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFillObject} />
            </MaskedView>
          </Animated.View>

          {/* Content overlay - white glass effect */}
          <View style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'flex-end', padding: 24 }}>
            {/* Deck name - prominent glass pill */}
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 20,
                paddingHorizontal: 24,
                paddingVertical: 12,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <Text style={{ color: 'white', fontSize: 28, fontWeight: '700', letterSpacing: -0.5 }}>
                {deck.name}
              </Text>
            </View>

            {/* Question count - subtle glass pill */}
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 16, fontWeight: '500' }}>
                {deck.estimatedQuestions} questions
              </Text>
            </View>

            {/* Premium badge - gold glass effect */}
            {deck.isPremium && (
              <View
                style={{
                  backgroundColor: 'rgba(250, 204, 21, 0.4)',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  marginTop: 4,
                  borderWidth: 1,
                  borderColor: 'rgba(253, 224, 71, 0.3)',
                }}
              >
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>
                  ✨ PREMIUM
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export const DeckMarqueeItem = memo(DeckMarqueeItemComponent);
