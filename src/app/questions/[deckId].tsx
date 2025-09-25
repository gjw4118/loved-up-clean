// Question Browsing Screen
// Displays questions from selected deck with swipeable cards and paywall integration

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import QuestionCard from '@/components/cards/QuestionCard';
import { GlassButton, StatusBar } from '@/components/ui';
import Colors, { getDeckColor } from '@/constants/Colors';
import { useQuestionDecks, useQuestions } from '@/hooks/questions/useQuestions';
import { usePaywall } from '@/hooks/usePaywall';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useTheme } from '@/hooks/useTheme';
import { useQuestionStore } from '@/stores/questionStore';
import { Question, QuestionDeck } from '@/types/questions';

export default function QuestionBrowsingScreen() {
  const { deckId, deckName } = useLocalSearchParams<{
    deckId: string;
    deckName: string;
  }>();

  const { theme: themeMode, isDark } = useTheme();
  const colors = Colors[themeMode] || Colors.light;
  
  // Safety check for isDark
  const safeIsDark = isDark || false;

  // Fetch data from Supabase
  const { data: decks, isLoading: decksLoading } = useQuestionDecks();
  const { data: allQuestions, isLoading: questionsLoading } = useQuestions(deckId || '', {
    limit: 100, // Get more questions for better experience
    excludeInteracted: false, // Show all questions for now
  });
  
  // Find the current deck
  const deck: QuestionDeck | undefined = decks?.find(d => d.id === deckId);
  
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

  const hasHitLimit = !(isPremium || false) && (allQuestions?.length || 0) > FREE_QUESTIONS_LIMIT;

  // Test data fallback
  const testQuestion: Question = {
    id: 'test-question',
    text: 'What is one thing you appreciate most about our relationship?',
    deck_id: deckId || 'test-deck',
    difficulty_level: 'medium' as const,
    tags: ['relationships', 'appreciation'],
    completion_rate: 0.0,
    skip_rate: 0.0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Use test data if no questions available (for debugging)
  const finalAvailableQuestions = availableQuestions.length > 0 ? availableQuestions : [testQuestion];

  // Debug logging temporarily disabled
  // console.log('Questions screen data:', {
  //   allQuestions: allQuestions?.length,
  //   availableQuestions: availableQuestions?.length,
  //   finalAvailableQuestions: finalAvailableQuestions?.length,
  //   deck,
  //   isPremium,
  //   FREE_QUESTIONS_LIMIT,
  //   isSpiceDeck,
  //   hasHitLimit,
  //   currentQuestion,
  //   currentQuestionText: currentQuestion?.text?.substring(0, 50)
  // });

  // Loading state
  const isLoading = decksLoading || questionsLoading || premiumLoading;

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

    // Debug logging temporarily disabled
    // console.log('Questions screen effect:', {
    //   availableQuestions: availableQuestions?.length,
    //   deck,
    //   currentSession,
    //   deckId
    // });

    if (finalAvailableQuestions && finalAvailableQuestions.length > 0 && deck && (!currentSession || currentSession.deckId !== deckId)) {
      console.log('Starting session with questions:', {
        deckId: deck.id,
        questionsLength: finalAvailableQuestions.length,
        firstQuestionId: finalAvailableQuestions[0]?.id,
        firstQuestionText: finalAvailableQuestions[0]?.text?.substring(0, 50)
      });
      startSession(deck, finalAvailableQuestions);
    }
  }, [finalAvailableQuestions, deck, currentSession, startSession, endSession, deckId]);

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={{ marginTop: 16, color: colors.text, fontSize: 16 }}>
            Loading questions...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if no deck or questions found
  if (!deck || !allQuestions || allQuestions.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center', marginBottom: 16 }}>
            No questions found for this deck
          </Text>
          <Text style={{ color: colors.text, fontSize: 14, textAlign: 'center', marginBottom: 16, opacity: 0.7 }}>
            Debug: deckId={deckId}, allQuestions={allQuestions?.length || 0}
          </Text>
          <GlassButton
            onPress={() => router.back()}
            style={{ paddingHorizontal: 24, paddingVertical: 12 }}
          >
            <Text style={{ color: colors.text, fontWeight: '600' }}>Go Back</Text>
          </GlassButton>
        </View>
      </SafeAreaView>
    );
  }

  // Handle question completion
  const handleComplete = async (questionId: string) => {
    console.log('handleComplete called', {
      questionId,
      hasMoreQuestions: hasMoreQuestions(),
      currentSession: !!currentSession,
      currentQuestion: currentQuestion?.id
    });

    if (hasMoreQuestions()) {
      console.log('handleComplete: calling nextQuestion');
      nextQuestion();
    } else {
      console.log('handleComplete: calling handleSessionComplete');
      handleSessionComplete();
    }
  };

  // Handle question skip
  const handleSkip = async (questionId: string) => {
    console.log('handleSkip called', {
      questionId,
      hasMoreQuestions: hasMoreQuestions(),
      currentSession: !!currentSession,
      currentQuestion: currentQuestion?.id
    });

    if (hasMoreQuestions()) {
      console.log('handleSkip: calling nextQuestion');
      nextQuestion();
    } else {
      console.log('handleSkip: calling handleSessionComplete');
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
          colors={safeIsDark ? ['#1a1a1a', '#2d2d2d'] : ['#f8fafc', '#e2e8f0', '#cbd5e1']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <StatusBar style={safeIsDark ? 'light' : 'dark'} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={safeIsDark ? '#ffffff' : '#374151'} />
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
          colors={safeIsDark ? ['#1a1a1a', '#2d2d2d'] : ['#f8fafc', '#e2e8f0', '#cbd5e1']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <StatusBar style={safeIsDark ? 'light' : 'dark'} />
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

  // Get questions for the card stack (show up to 3 cards)
  const getStackQuestions = () => {
    if (!currentSession || !currentSession.questions.length) return [testQuestion];

    const startIndex = Math.max(0, currentSession.currentQuestionIndex - 1);
    const endIndex = Math.min(currentSession.questions.length, startIndex + 3);
    return currentSession.questions.slice(startIndex, endIndex);
  };

  const stackQuestions = getStackQuestions();
  const displayQuestion = currentQuestion || testQuestion;

  const progress = getProgress();
  const questionNumber = getCurrentQuestionNumber();

  // Safety checks for progress calculation
  const safeProgressTotal = progress?.total || 1;
  const safeQuestionNumber = questionNumber || 1;

  // Debug logging for question navigation
  console.log('Questions screen render:', {
    currentQuestionId: currentQuestion?.id,
    currentQuestionText: currentQuestion?.text?.substring(0, 50),
    progress,
    questionNumber,
    hasCurrentQuestion: !!currentQuestion,
    hasDisplayQuestion: !!displayQuestion
  });

  return (
    <SafeAreaView className="flex-1">
      {/* Background */}
      <LinearGradient
        colors={safeIsDark ? ['#1a1a1a', '#2d2d2d'] : ['#f8fafc', '#e2e8f0', '#cbd5e1']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Subtle Glass Overlay */}
      <View className={`absolute inset-0 ${safeIsDark ? 'bg-white/5' : 'bg-black/5'}`} />
      <StatusBar style={safeIsDark ? 'light' : 'dark'} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={handleBack}
          className={`backdrop-blur-sm rounded-2xl px-4 py-3 border ${safeIsDark ? 'bg-white/20 border-white/20' : 'bg-white/80 border-white/20'}`}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text className="font-bold text-base text-gray-800 dark:text-white">← Back</Text>
        </Pressable>

        <View className="items-center flex-1 mx-4">
          <Text className="font-bold text-lg mb-1 text-gray-800 dark:text-white">
            {deck?.name || 'Loading...'}
          </Text>
          <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {safeQuestionNumber} of {safeProgressTotal}
            {(hasHitLimit || false) && !(isPremium || false) ? ` (Free: ${FREE_QUESTIONS_LIMIT || 5}/${allQuestions?.length || 0})` : ''}
          </Text>
          {stackQuestions.length > 1 && (
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
              +{stackQuestions.length - 1} {stackQuestions.length - 1 === 1 ? 'card' : 'cards'} ready
            </Text>
          )}
        </View>

        <View className="w-20" />
      </View>

      {/* Progress Bar */}
      <View className="px-6 mb-4">
        <View className={`backdrop-blur-sm rounded-full h-2 border ${safeIsDark ? 'bg-white/20 border-white/20' : 'bg-white/60 border-white/20'}`}>
          <View
            className={`rounded-full h-2 transition-all duration-500 ${safeIsDark ? 'bg-white' : 'bg-gray-800'}`}
            style={{ width: `${(safeQuestionNumber / safeProgressTotal) * 100}%` }}
          />
        </View>
      </View>

      {/* Question Card Stack - Improved Visual Design */}
      <View className="flex-1 mt-4" style={{ backgroundColor: 'transparent' }}>
        <View className="items-center justify-center flex-1 px-6 relative" style={{ backgroundColor: 'transparent' }}>
          {stackQuestions.map((question, index) => {
            const isTopCard = index === stackQuestions.length - 1;
            const isSecondCard = index === stackQuestions.length - 2;

            // Only show 2 cards max for better visual hierarchy
            if (index < stackQuestions.length - 2) return null;

            return (
              <View
                key={`card-${question.id}-${index}`}
                className="absolute"
                style={{
                  zIndex: isTopCard ? 3 : 2,
                }}
              >
                {/* Subtle background for non-top cards */}
                {!isTopCard && (
                  <View
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      borderRadius: 24,
                    }}
                  />
                )}

                {/* Visual indicator for interactive card */}
                {isTopCard && (
                  <View
                    className="absolute -top-2 -right-2 z-10 rounded-full px-2 py-1"
                    style={{
                      backgroundColor: deckColors?.primary || '#FF6B35',
                    }}
                  >
                    <Text className="text-white text-xs font-bold">SWIPE</Text>
                  </View>
                )}

                <QuestionCard
                  question={question}
                  deckCategory={deck?.category || 'friends'}
                  onComplete={isTopCard ? handleComplete : undefined}
                  onSkip={isTopCard ? handleSkip : undefined}
                  onShare={isTopCard ? handleShare : undefined}
                  showActions={false}
                  disabled={!isTopCard}
                  isInStack={!isTopCard}
                  stackPosition={isTopCard ? 'top' : 'bottom'}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* Swipe Hint - Elegant design */}
      <View className="px-6 pb-8">
        <View className={`backdrop-blur-sm rounded-full py-4 px-8 border ${safeIsDark ? 'bg-white/20 border-white/20' : 'bg-white/60 border-white/20'}`}>
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
