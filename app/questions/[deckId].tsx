// Question Browsing Screen
// Displays questions from selected deck with swipeable cards

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, Text, View } from 'react-native';

import QuestionCard from '@/components/cards/QuestionCard';
import { GlassButton, StatusBar } from '@/components/ui';
import { getDeckColor } from '@/constants/Colors';
import { QUESTION_DECKS } from '@/constants/decks';
import { useQuestions, useRecordInteraction } from '@/hooks/questions/useQuestions';
import { useQuestionStore } from '@/stores/questionStore';
import { InteractionType } from '@/types/questions';

export default function QuestionBrowsingScreen() {
  const { deckId, deckName } = useLocalSearchParams<{
    deckId: string;
    deckName: string;
  }>();

  // Get deck info
  const deck = QUESTION_DECKS.find(d => d.id === deckId);
  const deckColors = getDeckColor(deck?.category || 'friends');

  // Hooks
  const { data: questions, isLoading, error } = useQuestions(deckId || '');
  const recordInteraction = useRecordInteraction();
  
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
    if (questions && questions.length > 0 && deck && !currentSession) {
      startSession(deck, questions);
    }
  }, [questions, deck, currentSession, startSession]);

  // Handle question completion
  const handleComplete = async (questionId: string) => {
    try {
      await recordInteraction.mutateAsync({
        questionId,
        interactionType: InteractionType.COMPLETED,
        sessionId: currentSession?.id,
      });

      recordStoreInteraction(InteractionType.COMPLETED);
      
      if (hasMoreQuestions()) {
        nextQuestion();
      } else {
        handleSessionComplete();
      }
    } catch (error) {
      console.error('Error recording completion:', error);
      Alert.alert('Error', 'Failed to record your progress. Please try again.');
    }
  };

  // Handle question skip
  const handleSkip = async (questionId: string) => {
    try {
      await recordInteraction.mutateAsync({
        questionId,
        interactionType: InteractionType.SKIPPED,
        sessionId: currentSession?.id,
      });

      recordStoreInteraction(InteractionType.SKIPPED);
      
      if (hasMoreQuestions()) {
        nextQuestion();
      } else {
        handleSessionComplete();
      }
    } catch (error) {
      console.error('Error recording skip:', error);
      Alert.alert('Error', 'Failed to record your progress. Please try again.');
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

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={deckColors.gradient}
          className="absolute inset-0"
        />
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="white" />
          <Text className="text-white text-lg mt-4">Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !questions || questions.length === 0) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={deckColors.gradient}
          className="absolute inset-0"
        />
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-6xl mb-4">😔</Text>
          <Text className="text-2xl font-bold text-white mb-4 text-center">
            No Questions Available
          </Text>
          <Text className="text-white/80 text-center mb-8">
            We couldn't load questions for this deck. Please try again later.
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
  if (!currentQuestion) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={deckColors.gradient}
          className="absolute inset-0"
        />
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      </SafeAreaView>
    );
  }

  const progress = getProgress();
  const questionNumber = getCurrentQuestionNumber();

  return (
    <SafeAreaView className="flex-1">
      {/* Background */}
      <LinearGradient
        colors={deckColors.gradient}
        className="absolute inset-0"
      />
      <StatusBar style="light" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <GlassButton
          onPress={handleBack}
          intensity={30}
          tint="light"
          className="bg-white/20"
        >
          <Text className="text-white font-semibold">← Back</Text>
        </GlassButton>

        <View className="items-center">
          <Text className="text-white font-bold text-lg">
            {deck?.name}
          </Text>
          <Text className="text-white/80 text-sm">
            {questionNumber} of {progress.total}
          </Text>
        </View>

        <View className="w-20" /> {/* Spacer for centering */}
      </View>

      {/* Progress Bar */}
      <View className="px-4 mb-4">
        <View className="bg-white/20 rounded-full h-2">
          <View
            className="bg-white/60 rounded-full h-2 transition-all duration-300"
            style={{ width: `${(questionNumber / progress.total) * 100}%` }}
          />
        </View>
      </View>

      {/* Question Card */}
      <View className="flex-1">
        <QuestionCard
          question={currentQuestion}
          deckCategory={deck?.category || 'friends'}
          onComplete={handleComplete}
          onSkip={handleSkip}
          onShare={handleShare}
          showActions={true}
          disabled={recordInteraction.isPending}
        />
      </View>

      {/* Navigation Hints */}
      <View className="px-4 pb-4">
        <Text className="text-white/60 text-center text-sm">
          Swipe or tap buttons to interact with questions
        </Text>
      </View>
    </SafeAreaView>
  );
}
