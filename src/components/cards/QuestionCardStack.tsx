import { useQuestionCardAnimation } from '@/lib/contexts/QuestionCardAnimationContext';
import { useQuestionStackAnimation } from '@/lib/contexts/QuestionStackAnimationContext';
import { Question } from '@/types/questions';
import React, { FC, memo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle
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
    const isCurrent = index === currentQuestionIndex.value;
    const isNext = index === currentQuestionIndex.value + 1;
    const isNextNext = index === currentQuestionIndex.value + 2;

    // Calculate depth offset for stacking effect
    const depthOffset = index - animatedQuestionIndex.value;
    
    // Only apply pan to current card
    const translateX = isCurrent ? panX.value : 0;
    const translateY = isCurrent ? panY.value : 0;

    // Rotation direction: dragging from bottom half tilts opposite for a natural hinge effect
    const sign = absoluteYAnchor.value > height / 2 ? -1 : 1;
    const rotate = isCurrent ? interpolate(panX.value, [0, panDistance], [0, sign * 4]) : 0;

    // Stack effect: cards behind the current card are offset down and scaled down
    const stackOffset = depthOffset > 0 ? Math.min(depthOffset * 12, 24) : 0;
    const stackScale = depthOffset > 0 ? 1 - Math.min(depthOffset * 0.03, 0.06) : 1;

    return {
      // Show current card and next 2 cards
      opacity: isCurrent || isNext || isNextNext ? 1 : 0,
      zIndex: isCurrent ? 100 : 50 - depthOffset,
      transform: [
        {
          translateX,
        },
        {
          translateY: translateY + stackOffset,
        },
        {
          rotate: `${rotate}deg`,
        },
        {
          scale: stackScale,
        },
      ],
    };
  });

  return (
    <Animated.View
      key={`card-${question.id}-${index}`}
      style={[styles.container, containerStyle]}
    >
      <View className="flex-1 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-lg overflow-hidden">
        {/* Question Card */}
        <QuestionCard
          question={question}
          deckCategory={deckCategory}
          isTopCard={index === currentQuestionIndex.value}
          stackPosition={index === currentQuestionIndex.value ? 'top' : 'bottom'}
        />

        {/* Swipe Indicators (only on top card) */}
        {index === currentQuestionIndex.value && <SwipeIndicators />}
      </View>
    </Animated.View>
  );
});

CardContainer.displayName = 'CardContainer';

export const QuestionCardStack: FC<QuestionCardStackProps> = ({
  questions,
  deckCategory,
}) => {
  const { currentQuestionIndex } = useQuestionStackAnimation();

  // Get visible cards (current + next 2 cards)
  const visibleQuestions = questions.slice(
    currentQuestionIndex.value,
    Math.min(questions.length, currentQuestionIndex.value + 3)
  );

  return (
    <View style={styles.stackContainer}>
      {visibleQuestions.map((question, idx) => {
        // Calculate actual index in full array
        const actualIndex = currentQuestionIndex.value + idx;
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
    width: '100%',
    position: 'relative',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // @ts-ignore - borderCurve is iOS-only
    borderCurve: 'continuous',
  },
});

