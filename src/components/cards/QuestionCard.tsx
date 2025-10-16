// QuestionCard Component
// Slack-style card with dark, neutral aesthetic
// Simplified to visual-only component for use in QuestionCardStack

import React from 'react';
import { Text, View } from 'react-native';

import { getDeckColor } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Question } from '@/types/questions';

interface QuestionCardProps {
  question: Question;
  deckCategory: string;
  isTopCard?: boolean;
  stackPosition?: 'top' | 'bottom';
}

export default function QuestionCard({
  question,
  deckCategory,
  isTopCard = true,
  stackPosition = 'top',
}: QuestionCardProps) {
  // Theme
  const { isDark } = useTheme();

  // Safety check for question
  if (!question || !question.text) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-900 border border-neutral-800 rounded-3xl">
        <Text className="text-lg text-neutral-400">
          {question ? 'No question text available' : 'Loading question...'}
        </Text>
      </View>
    );
  }

  // Get deck colors for accent
  const deckColors = getDeckColor(deckCategory);

  return (
    <View className="flex-1 bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
      {/* Header - Deck Category */}
      <View 
        className="p-4 flex-row items-center justify-center border-b border-neutral-800"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
      >
        <Text className="text-neutral-300 text-base font-semibold capitalize">
          {deckCategory}
        </Text>
      </View>

      {/* Main Content - Question */}
      <View className="flex-1 p-8 justify-center items-center">
        <Text
          className="text-center text-white"
          style={{
            fontSize: stackPosition === 'top' ? 32 : 28,
            fontWeight: '600',
            letterSpacing: -0.5,
            lineHeight: stackPosition === 'top' ? 40 : 36,
          }}
        >
          {question.text}
        </Text>
      </View>

      {/* Footer - Subtle Accent */}
      <View 
        className="p-6 border-t border-neutral-800"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
      >
        <View 
          className="w-full h-1 rounded-full"
          style={{ backgroundColor: deckColors.primary, opacity: 0.5 }}
        />
      </View>
    </View>
  );
}