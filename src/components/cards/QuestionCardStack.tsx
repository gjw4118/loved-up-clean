import { useQuestionCardAnimation } from '@/lib/contexts/QuestionCardAnimationContext';
import { useQuestionStackAnimation } from '@/lib/contexts/QuestionStackAnimationContext';
import { Question } from '@/types/questions';
import React, { FC, memo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated';
import QuestionCard from './QuestionCard';
import { SwipeIndicators } from './SwipeIndicators';

// QuestionCardStack Component
// Renders stack of 3 cards with Slack-style depth effects
// Based on Slack's ChannelContainer

interface QuestionCardStackProps {
  questions: Question[];
  deckCategory: string;
}

interface CardContainerProps {
  question: Question;
  index: number;
  deckCategory: string;
}

const CardContainer: FC<CardContainerProps> = memo(({ question, index, deckCategory }) => {
  const { width, height } = useWindowDimensions();
  const { animatedQuestionIndex, currentQuestionIndex } = useQuestionStackAnimation();
  const { panX, panY, absoluteYAnchor, panDistance } = useQuestionCardAnimation();

  const containerStyle = useAnimatedStyle(() => {
    // Compute neighbors relative to the active index to limit work to only visible cards
    const isLast = index === currentQuestionIndex.value;
    const isSecondLast = index === currentQuestionIndex.value - 1;
    const isThirdLast = index === currentQuestionIndex.value - 2;
    const isNextToLast = index === currentQuestionIndex.value + 1;

    // Interpolate based on the visual progress in "card index" space
    const inputRange = [index - 2, index - 1, index, index + 1, index + 2];

    // Rotation direction: dragging from bottom half tilts opposite for a natural hinge effect
    const sign = absoluteYAnchor.value > height / 2 ? -1 : 1;

    // Subtle parallax: cards below the top one slide down slightly as the top card moves away
    const top = interpolate(
      animatedQuestionIndex.value,
      inputRange,
      [0, 0, 0, width * 0.07, width * 0.01],
      Extrapolation.CLAMP
    );

    // Rotate top card up to 4deg as user drags by panDistance
    const rotate = interpolate(panX.value, [0, panDistance], [0, sign * 4]);

    // Scale stack: next cards scale down slightly to create depth
    const scale = interpolate(
      animatedQuestionIndex.value,
      inputRange,
      [1, 1, 1, 0.95, 0.95],
      Extrapolation.CLAMP
    );

    return {
      top,
      // Hide far cards to reduce overdraw
      opacity: isLast || isSecondLast || isThirdLast || isNextToLast ? 1 : 0,
      transform: [
        {
          translateX: panX.value,
        },
        {
          translateY: panY.value,
        },
        {
          rotate: `${rotate}deg`,
        },
        {
          scale,
        },
      ],
    };
  });

  return (
    <Animated.View
      key={`card-${question.id}-${index}`}
      className="absolute w-full h-full bg-neutral-900 border border-neutral-800 rounded-3xl shadow-lg overflow-hidden"
      style={[styles.container, containerStyle]}
    >
      {/* Question Card */}
      <QuestionCard
        question={question}
        deckCategory={deckCategory}
        isTopCard={index === currentQuestionIndex.value}
        stackPosition={index === currentQuestionIndex.value ? 'top' : 'bottom'}
      />

      {/* Swipe Indicators (only on top card) */}
      {index === currentQuestionIndex.value && <SwipeIndicators />}
    </Animated.View>
  );
});

CardContainer.displayName = 'CardContainer';

export const QuestionCardStack: FC<QuestionCardStackProps> = ({
  questions,
  deckCategory,
}) => {
  const { currentQuestionIndex } = useQuestionStackAnimation();

  // Get visible cards (current + 2 behind)
  const visibleQuestions = questions.slice(
    Math.max(0, currentQuestionIndex.value - 2),
    currentQuestionIndex.value + 1
  );

  return (
    <View style={styles.stackContainer}>
      {visibleQuestions.map((question, idx) => {
        // Calculate actual index in full array
        const actualIndex = Math.max(0, currentQuestionIndex.value - 2) + idx;
        return (
          <CardContainer
            key={`card-${question.id}`}
            question={question}
            index={actualIndex}
            deckCategory={deckCategory}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  stackContainer: {
    flex: 1,
    position: 'relative',
  },
  container: {
    // @ts-ignore - borderCurve is iOS-only
    borderCurve: 'continuous',
  },
});

