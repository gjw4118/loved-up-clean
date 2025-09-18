// Question Browsing Screen
// Displays questions from selected deck with swipeable cards and paywall integration

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, Text, View } from 'react-native';

import QuestionCard from '@/components/cards/QuestionCard';
import { GlassButton, StatusBar } from '@/components/ui';
import { getDeckColor } from '@/constants/Colors';
import { getHardcodedDeck, getHardcodedQuestions, HardcodedQuestion } from '@/constants/hardcodedQuestions';
import { usePaywall } from '@/hooks/usePaywall';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useTheme } from '@/hooks/useTheme';
import { useQuestionStore } from '@/stores/questionStore';
import { DeckCategory, Question, QuestionDeck } from '@/types/questions';

export default function QuestionBrowsingScreen() {
  const { deckId, deckName } = useLocalSearchParams<{
    deckId: string;
    deckName: string;
  }>();

  const { theme, isDark } = useTheme();

  // Get hardcoded data
  const hardcodedDeck = getHardcodedDeck(deckId || '');
  const hardcodedQuestions = getHardcodedQuestions(deckId || '');
  
  // Convert HardcodedDeck to QuestionDeck type
  const deck: QuestionDeck | undefined = hardcodedDeck ? {
    id: hardcodedDeck.id,
    name: hardcodedDeck.name,
    description: hardcodedDeck.description,
    category: hardcodedDeck.category as DeckCategory,
    icon: hardcodedDeck.icon,
    question_count: hardcodedDeck.question_count,
    popularity_score: hardcodedDeck.popularity_score,
    created_at: hardcodedDeck.created_at,
    updated_at: hardcodedDeck.updated_at,
  } : undefined;
  
  // Convert HardcodedQuestion to Question type
  const allQuestions: Question[] = hardcodedQuestions.map((q: HardcodedQuestion) => ({
    id: q.id,
    deck_id: q.deck_id,
    text: q.text,
    difficulty_level: q.difficulty_level as any, // Type assertion since enum values match
    tags: q.tags,
    completion_rate: q.completion_rate,
    skip_rate: q.skip_rate,
    created_at: q.created_at,
    updated_at: q.updated_at,
  }));
  
  const { isPremium, loading: premiumLoading } = usePremiumStatus();
  const { isPresenting, presentPaywall } = usePaywall();
  
  const deckColors = getDeckColor(deck?.category || 'friends');
  
  // Ensure gradient is always valid
  const gradientColors = deckColors?.gradient || ['#FF6B35', '#F7931E'];

  // Freemium logic
  const FREE_QUESTIONS_LIMIT = 5;
  const isSpiceDeck = deck?.category === 'spice';
  const availableQuestions = isPremium 
    ? allQuestions || []
    : allQuestions?.slice(0, FREE_QUESTIONS_LIMIT) || [];
  
  const hasHitLimit = !isPremium && allQuestions && allQuestions.length > FREE_QUESTIONS_LIMIT;

  // Store
  const {
    currentSession,
    currentQuestion,
    currentDeck,
    startSession,
    endSession,
    nextQuestion,
    previousQuestion,
    recordInteraction: recordStoreInteraction,
    getProgress,
    getCurrentQuestionNumber,
    hasMoreQuestions,
  } = useQuestionStore();

  // Initialize session when questions load
  useEffect(() => {
    // Clear existing session if it's for a different deck
    if (currentSession && currentSession.deckId !== deckId) {
      endSession();
    }
    
    if (availableQuestions && availableQuestions.length > 0 && deck && (!currentSession || currentSession.deckId !== deckId)) {
      startSession(deck, availableQuestions);
    }
  }, [availableQuestions, deck, currentSession, startSession, endSession, deckId]);

  // Handle question completion
  const handleComplete = async (questionId: string) => {
    if (hasMoreQuestions()) {
      nextQuestion();
    } else {
      handleSessionComplete();
    }
  };

  // Handle question skip
  const handleSkip = async (questionId: string) => {
    if (hasMoreQuestions()) {
      nextQuestion();
    } else {
      handleSessionComplete();
    }
  };

  // Handle question sharing
  const handleShare = async (questionId: string) => {
    // TODO: Implement sharing functionality
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Share', 'Sharing functionality coming soon!');
  };

  // Handle session completion
  const handleSessionComplete = () => {
    const progress = getProgress();
    
    if (hasHitLimit && !isPremium) {
      // Show premium upgrade prompt
      Alert.alert(
        'Unlock More Questions! 🔓',
        `You've completed ${progress.completed} free questions from ${deckName}. Upgrade to Premium to access all ${allQuestions?.length || 0} questions and unlock the Spice deck!`,
        [
          {
            text: 'Go Back',
            onPress: () => {
              endSession();
              router.back();
            },
          },
          {
            text: 'Upgrade Now',
            style: 'default',
            onPress: () => {
              endSession();
              presentPaywall('deck_completion');
            },
          },
        ]
      );
    } else {
      // Regular completion
      Alert.alert(
        'Deck Complete! 🎉',
        `You've completed ${progress.completed} questions from ${deckName}. Great job!`,
        [
          {
            text: 'Continue',
            onPress: () => {
              endSession();
              router.back();
            },
          },
        ]
      );
    }
  };

  // Handle back navigation
  const handleBack = () => {
    Alert.alert(
      'Leave Session?',
      'Your progress will be saved, but you\'ll exit the current session.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            endSession();
            router.back();
          },
        },
      ]
    );
  };

  // Loading state (only for premium status)
  if (premiumLoading) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={isDark ? ['#1a1a1a', '#2d2d2d'] : ['#f8fafc', '#e2e8f0', '#cbd5e1']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#374151'} />
          <Text className="text-lg mt-4 text-gray-800 dark:text-white">Loading premium status...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Check for Spice deck access
  if (isSpiceDeck && !isPremium) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-6xl mb-4">LOCK</Text>
          <Text className="text-3xl font-bold text-white mb-4 text-center">
            Premium Required
          </Text>
          <Text className="text-white/90 text-center mb-8 text-lg leading-6">
            The Spice deck is exclusive to Premium users. Upgrade now to unlock intimate questions that will deepen your connection!
          </Text>
          <GlassButton
            onPress={() => router.back()}
            intensity={30}
            tint="light"
            className="bg-white/20 mb-4"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </GlassButton>
          <GlassButton
            onPress={() => presentPaywall('spice_deck')}
            intensity={40}
            tint="light"
            className="bg-yellow-500/30"
          >
            <Text className="text-white font-semibold">★ Upgrade to Premium</Text>
          </GlassButton>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (!deck || !allQuestions || allQuestions.length === 0) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={isDark ? ['#1a1a1a', '#2d2d2d'] : ['#f8fafc', '#e2e8f0', '#cbd5e1']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-20 h-20 rounded-full items-center justify-center mb-4 bg-gray-200 dark:bg-gray-700">
            <Text className="text-3xl font-bold text-gray-600 dark:text-gray-300">!</Text>
          </View>
          <Text className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
            No Questions Available
          </Text>
          <Text className="text-center mb-8 text-gray-600 dark:text-gray-300">
            We couldn't find questions for this deck. Please try a different deck.
          </Text>
          <GlassButton
            onPress={() => router.back()}
            intensity={30}
            tint="light"
            className="bg-white/20"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </GlassButton>
        </View>
      </SafeAreaView>
    );
  }

  // No current question (shouldn't happen)
  if (!currentQuestion || !currentQuestion.text) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={isDark ? ['#1a1a1a', '#2d2d2d'] : ['#f8fafc', '#e2e8f0', '#cbd5e1']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#374151'} />
          <Text className="text-lg mt-4 text-gray-800 dark:text-white">
            Loading question...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const progress = getProgress();
  const questionNumber = getCurrentQuestionNumber();
  
  // Safety checks for progress calculation
  const safeProgressTotal = progress.total || 1;
  const safeQuestionNumber = questionNumber || 1;

  return (
    <SafeAreaView className="flex-1">
      {/* Background */}
      <LinearGradient
        colors={isDark ? ['#1a1a1a', '#2d2d2d'] : ['#f8fafc', '#e2e8f0', '#cbd5e1']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Subtle Glass Overlay */}
      <View className={`absolute inset-0 ${isDark ? 'bg-white/5' : 'bg-black/5'}`} />
      <StatusBar style={isDark ? 'light' : 'dark'} />


      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={handleBack}
          className={`backdrop-blur-sm rounded-2xl px-4 py-3 border ${isDark ? 'bg-white/20 border-white/20' : 'bg-white/80 border-white/20'}`}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text className="font-bold text-base text-gray-800 dark:text-white">← Back</Text>
        </Pressable>

        <View className="items-center flex-1 mx-4">
          <Text className="font-bold text-lg mb-1 text-gray-800 dark:text-white">
            {deck?.name}
          </Text>
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {safeQuestionNumber} of {safeProgressTotal}
            {hasHitLimit && !isPremium && ` (Free: ${FREE_QUESTIONS_LIMIT}/${allQuestions?.length || 0})`}
          </Text>
        </View>

        <View className="w-20" /> {/* Spacer for centering */}
      </View>

      {/* Progress Bar */}
      <View className="px-6 mb-4">
        <View className={`backdrop-blur-sm rounded-full h-2 border ${isDark ? 'bg-white/20 border-white/20' : 'bg-white/60 border-white/20'}`}>
          <View
            className={`rounded-full h-2 transition-all duration-500 ${isDark ? 'bg-white' : 'bg-gray-800'}`}
            style={{ width: `${(safeQuestionNumber / safeProgressTotal) * 100}%` }}
          />
        </View>
      </View>

      {/* Question Card */}
      <View className="flex-1 mt-4">
        <QuestionCard
          question={currentQuestion}
          deckCategory={deck?.category || 'friends'}
          onComplete={handleComplete}
          onSkip={handleSkip}
          onShare={handleShare}
          showActions={false}
          disabled={false}
        />
      </View>

      {/* Action Buttons - Below the card */}
      <View className="px-6 pb-8">
        <View className="flex-row justify-center items-center space-x-8 mb-6">
          <Pressable
            onPress={handleSkip}
            className={`backdrop-blur-sm rounded-3xl px-10 py-5 border ${isDark ? 'bg-white/20 border-white/20' : 'bg-white/80 border-white/20'}`}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.95 : 1 }],
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text 
              className="font-medium text-lg text-gray-700 dark:text-gray-300"
              style={{ fontWeight: '500' }}
            >
              Skip
            </Text>
          </Pressable>

          <Pressable
            onPress={handleComplete}
            className={`rounded-3xl px-10 py-5 ${isDark ? 'bg-white' : 'bg-gray-900'}`}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.95 : 1 }],
              opacity: pressed ? 0.9 : 1,
            })}
          >
            <Text 
              className="font-medium text-lg text-white dark:text-gray-900"
              style={{ fontWeight: '500' }}
            >
              Complete
            </Text>
          </Pressable>
        </View>

        {/* Swipe Hint - Elegant design */}
        <View className={`backdrop-blur-sm rounded-full py-4 px-8 border ${isDark ? 'bg-white/20 border-white/20' : 'bg-white/60 border-white/20'}`}>
          <Text 
            className="text-center text-base font-medium text-gray-600 dark:text-gray-300"
            style={{ fontWeight: '400' }}
          >
            Swipe left to skip • Swipe right to complete
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
