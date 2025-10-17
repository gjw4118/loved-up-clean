import { useQuestionCardAnimation } from '@/lib/contexts/QuestionCardAnimationContext';
import { useQuestionStackAnimation } from '@/lib/contexts/QuestionStackAnimationContext';
import { Question } from '@/types/questions';
import React, { FC, memo, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedReaction,
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
    // Two-card system: only show current card and next card
    const isCurrent = index === currentQuestionIndex.value;
    const isNext = index === currentQuestionIndex.value + 1;
    
    // Calculate depth offset for stacking effect
    const depthOffset = index - animatedQuestionIndex.value;
    
    // Only apply pan to current card
    const translateX = isCurrent ? panX.value : 0;
    const translateY = isCurrent ? panY.value : 0;

    // Rotation direction: dragging from bottom half tilts opposite for a natural hinge effect
    const sign = absoluteYAnchor.value > height / 2 ? -1 : 1;
    const rotate = isCurrent ? interpolate(panX.value, [0, panDistance], [0, sign * 4]) : 0;

    // Stack effect: bottom card is slightly offset down and scaled down
    const stackOffset = depthOffset > 0 ? 12 : 0;
    const stackScale = depthOffset > 0 ? 0.97 : 1;
    
    // Swipe-based fade in: next card only appears after 50% swipe
    let opacity = 0;
    if (isCurrent) {
      opacity = 1;
    } else if (isNext) {
      // Calculate swipe progress (0 to 1)
      const swipeProgress = Math.abs(panX.value) / (panDistance * 2);
      // Only fade in after 50% swipe
      if (swipeProgress > 0.5) {
        opacity = interpolate(swipeProgress, [0.5, 1], [0, 1]);
      } else {
        opacity = 0;
      }
    }

    return {
      opacity,
      zIndex: isCurrent ? 100 : 50,
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
  const [currentIdx, setCurrentIdx] = useState(0);

  // Use animated reaction to sync state with shared value
  useAnimatedReaction(
    () => currentQuestionIndex.value,
    (value) => {
      runOnJS(setCurrentIdx)(Math.floor(value));
    },
    [currentQuestionIndex]
  );

  // Two-card system: only render current card and next card
  const visibleQuestions = questions.slice(
    currentIdx,
    Math.min(questions.length, currentIdx + 2)
  );

  return (
    <View style={styles.stackContainer}>
      {visibleQuestions.map((question, idx) => {
        // Calculate actual index in full array
        const actualIndex = currentIdx + idx;
        
        return (
          <CardContainer
            key={`card-${question.id}-${actualIndex}`}
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

