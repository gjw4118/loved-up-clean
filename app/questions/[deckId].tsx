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
import { getHardcodedDeck, getHardcodedQuestions } from '@/constants/hardcodedQuestions';
import { usePaywall } from '@/hooks/usePaywall';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useQuestionStore } from '@/stores/questionStore';

export default function QuestionBrowsingScreen() {
  const { deckId, deckName } = useLocalSearchParams<{
    deckId: string;
    deckName: string;
  }>();

  // Get hardcoded data
  const deck = getHardcodedDeck(deckId || '');
  const allQuestions = getHardcodedQuestions(deckId || '');
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
          colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
          className="absolute inset-0"
        />
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#374151" />
          <Text className="text-gray-800 text-lg mt-4">Loading premium status...</Text>
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
          className="absolute inset-0"
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
          colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
          className="absolute inset-0"
        />
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center px-8">
          <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center mb-4">
            <Text className="text-3xl font-bold text-gray-600">!</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
            No Questions Available
          </Text>
          <Text className="text-gray-600 text-center mb-8">
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
  if (!currentQuestion) {
    return (
      <SafeAreaView className="flex-1">
        <LinearGradient
          colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
          className="absolute inset-0"
        />
        <StatusBar style="light" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#374151" />
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
        colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
        className="absolute inset-0"
      />
      <StatusBar style="light" />


      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={handleBack}
          className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-gray-200"
        >
          <Text className="text-gray-800 font-bold text-base">← Back</Text>
        </Pressable>

        <View className="items-center flex-1 mx-4">
          <Text className="text-gray-800 font-bold text-lg mb-1">
            {deck?.name}
          </Text>
          <Text className="text-gray-600 text-sm font-medium">
            {questionNumber} of {progress.total}
            {hasHitLimit && !isPremium && (
              <Text className="text-orange-500 font-bold"> (Free: {FREE_QUESTIONS_LIMIT}/{allQuestions?.length || 0})</Text>
            )}
          </Text>
        </View>

        <View className="w-20" /> {/* Spacer for centering */}
      </View>

      {/* Progress Bar */}
      <View className="px-6 mb-4">
        <View className="bg-white/60 backdrop-blur-sm rounded-full h-2 border border-gray-200">
          <View
            className="bg-gray-800 rounded-full h-2 transition-all duration-500"
            style={{ width: `${(questionNumber / progress.total) * 100}%` }}
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
            className="bg-white/80 backdrop-blur-sm rounded-3xl px-10 py-5 border border-gray-200/50"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Text 
              className="text-gray-700 font-medium text-lg"
              style={{ fontWeight: '500' }}
            >
              Skip
            </Text>
          </Pressable>

          <Pressable
            onPress={handleComplete}
            className="bg-gray-900 rounded-3xl px-10 py-5"
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Text 
              className="text-white font-medium text-lg"
              style={{ fontWeight: '500' }}
            >
              Complete
            </Text>
          </Pressable>
        </View>

        {/* Swipe Hint - Elegant design */}
        <View className="bg-white/60 backdrop-blur-sm rounded-full py-4 px-8 border border-white/20">
          <Text 
            className="text-gray-600 text-center text-base font-medium"
            style={{ fontWeight: '400' }}
          >
            Swipe left to skip • Swipe right to complete
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
