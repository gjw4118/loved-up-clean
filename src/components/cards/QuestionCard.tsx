// QuestionCard Component
// Elegant glass card with HeroUI aesthetic
// Simplified to visual-only component for use in QuestionCardStack

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '@/lib/contexts/ThemeContext';
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
      <View className="flex-1 items-center justify-center rounded-3xl overflow-hidden">
        <LinearGradient
          colors={isDark ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f5f5f5']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View 
          className="flex-1 items-center justify-center"
          style={{ 
            backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
          }}
        >
          <Text className="text-lg text-gray-500 dark:text-gray-400">
            {question ? 'No question text available' : 'Loading question...'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 rounded-3xl overflow-hidden" style={{ 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.6 : 0.15,
      shadowRadius: 24,
      elevation: 12,
    }}>
      {/* Background Gradient - Neutral */}
      <LinearGradient
        colors={isDark 
          ? ['#1a1a1a', '#2d2d2d', '#1a1a1a'] 
          : ['#ffffff', '#f8f9fa', '#ffffff']
        }
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Glass Layer */}
      <View 
        className="flex-1"
        style={{ 
          backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
        }}
      >
        {/* Header - Deck Category */}
        <View 
          className="p-5 flex-row items-center justify-center"
          style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          }}
        >
          <Text 
            className="text-base font-semibold capitalize"
            style={{ 
              color: isDark ? '#e5e5e5' : '#4a4a4a',
              letterSpacing: 1,
            }}
          >
            {deckCategory}
          </Text>
        </View>

        {/* Main Content - Question */}
        <View className="flex-1 px-10 py-12 justify-center items-center">
          <Text
            className="text-center"
            style={{
              fontSize: stackPosition === 'top' ? 34 : 30,
              fontWeight: '600',
              letterSpacing: -0.5,
              lineHeight: stackPosition === 'top' ? 44 : 40,
              color: isDark ? '#ffffff' : '#1a1a1a',
            }}
          >
            {question.text}
          </Text>
        </View>

        {/* Footer - Subtle Decoration */}
        <View 
          className="px-8 py-6"
          style={{ 
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderTopWidth: 1,
            borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
          }}
        >
          <View 
            className="w-full h-1 rounded-full"
            style={{ 
              backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
            }}
          />
        </View>
      </View>
    </View>
  );
}