// Question Browsing Screen
// Displays questions from selected deck with Slack-style swipeable card stack

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestionCardStack } from '@/components/cards/QuestionCardStack';
import { GlassButton, StatusBar } from '@/components/ui';
import Colors, { getDeckColor } from '@/constants/Colors';
import { useQuestionDecks, useQuestions } from '@/hooks/questions/useQuestions';
import { usePaywall } from '@/hooks/usePaywall';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { QuestionCardAnimationProvider } from '@/lib/contexts/QuestionCardAnimationContext';
import { QuestionStackAnimationProvider } from '@/lib/contexts/QuestionStackAnimationContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useQuestionStore } from '@/stores/questionStore';
import { DepthLevel, Question, QuestionDeck } from '@/types/questions';

export default function QuestionBrowsingScreen() {
  const { deckId, deckName } = useLocalSearchParams<{
    deckId: string;
    deckName: string;
  }>();

  const { theme: themeMode, isDark } = useTheme();
  const colors = Colors[themeMode] || Colors.light;
  
  // Safety check for isDark
  const safeIsDark = isDark || false;

  // Depth level toggle state
  const [depthLevel, setDepthLevel] = useState<DepthLevel>(DepthLevel.STANDARD);
  
  // Swipe hint state
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const hintOpacity = useRef(new Animated.Value(0)).current;
  const SWIPE_HINT_KEY = '@hasSeenSwipeHint';

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

  // Filter questions by depth level
  const depthFilteredQuestions = allQuestions?.filter(q => q.depth_level === depthLevel) || [];

  // Freemium logic
  const FREE_QUESTIONS_LIMIT = 5;
  const isSpiceDeck = deck?.category === 'spice';
  const availableQuestions = isPremium
    ? depthFilteredQuestions
    : depthFilteredQuestions.slice(0, FREE_QUESTIONS_LIMIT);

  const hasHitLimit = !(isPremium || false) && depthFilteredQuestions.length > FREE_QUESTIONS_LIMIT;

  // Test data fallback
  const testQuestion: Question = {
    id: 'test-question',
    text: 'What is one thing you appreciate most about our relationship?',
    deck_id: deckId || 'test-deck',
    depth_level: depthLevel,
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

  // Check if user has seen swipe hint before
  useEffect(() => {
    const checkSwipeHint = async () => {
      try {
        const hasSeenHint = await AsyncStorage.getItem(SWIPE_HINT_KEY);
        if (!hasSeenHint) {
          setShowSwipeHint(true);
          // Fade in the hint
          Animated.timing(hintOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
      } catch (error) {
        console.error('Error checking swipe hint:', error);
      }
    };
    checkSwipeHint();
  }, []);

  // Hide swipe hint on first interaction
  const hideSwipeHint = async () => {
    if (showSwipeHint) {
      Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowSwipeHint(false);
      });
      
      try {
        await AsyncStorage.setItem(SWIPE_HINT_KEY, 'true');
      } catch (error) {
        console.error('Error saving swipe hint:', error);
      }
    }
  };

  // Initialize session when deck loads
  useEffect(() => {
    // Clear existing session if it's for a different deck
    if (currentSession && currentSession.deckId !== deckId) {
      endSession();
      return; // Early return to prevent starting new session in same render
    }

    // Start new session if we have questions and deck
    if (finalAvailableQuestions && finalAvailableQuestions.length > 0 && deck && !currentSession) {
      console.log('Starting session with questions:', {
        deckId: deck.id,
        depthLevel,
        questionsLength: finalAvailableQuestions.length,
        firstQuestionId: finalAvailableQuestions[0]?.id,
        firstQuestionText: finalAvailableQuestions[0]?.text?.substring(0, 50)
      });
      startSession(deck, finalAvailableQuestions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalAvailableQuestions, deck, deckId]);

  // Handle depth level changes - restart session with new questions
  useEffect(() => {
    // Only restart if we already have an active session
    if (currentSession && finalAvailableQuestions && finalAvailableQuestions.length > 0 && deck) {
      console.log('Depth level changed, restarting session:', {
        deckId: deck.id,
        depthLevel,
        questionsLength: finalAvailableQuestions.length,
      });
      endSession();
      // Use setTimeout to ensure state update completes before starting new session
      setTimeout(() => {
        startSession(deck, finalAvailableQuestions);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depthLevel]);

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
          >
            <Text style={{ color: colors.text, fontWeight: '600', paddingHorizontal: 24, paddingVertical: 12 }}>Go Back</Text>
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
    endSession();
    router.back();
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

  const displayQuestion = currentQuestion || testQuestion;

  // Fix progress calculation to show current position
  const currentIndex = currentSession?.currentQuestionIndex ?? 0;
  const safeQuestionNumber = currentIndex + 1;
  const safeProgressTotal = finalAvailableQuestions.length;

  // Debug logging for question navigation
  console.log('Questions screen render:', {
    currentQuestionId: currentQuestion?.id,
    currentQuestionText: currentQuestion?.text?.substring(0, 50),
    currentIndex,
    safeQuestionNumber,
    safeProgressTotal,
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

      {/* Header - Minimal with Native Toggle */}
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

        {/* Spacer */}
        <View className="flex-1" />

        {/* Native Depth Toggle */}
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <Text 
            className="text-sm font-medium"
            style={{ color: safeIsDark ? '#FFFFFF' : '#1F2937' }}
          >
            Deeper?
          </Text>
          <Switch
            value={depthLevel === DepthLevel.DEEPER}
            onValueChange={async (value) => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setDepthLevel(value ? DepthLevel.DEEPER : DepthLevel.STANDARD);
            }}
            trackColor={{ 
              false: safeIsDark ? '#4B5563' : '#D1D5DB', 
              true: safeIsDark ? '#3B82F6' : '#2563EB' 
            }}
            thumbColor={safeIsDark ? '#F9FAFB' : '#FFFFFF'}
            ios_backgroundColor={safeIsDark ? '#4B5563' : '#D1D5DB'}
          />
        </View>
      </View>

      {/* Question Card Stack - New Slack-style implementation */}
      <View className="flex-1 mt-4" style={{ backgroundColor: 'transparent' }}>
        <QuestionStackAnimationProvider totalQuestions={finalAvailableQuestions.length}>
          <QuestionCardAnimationProvider onSwipe={hideSwipeHint}>
            <View className="items-center justify-center flex-1 px-6" style={{ backgroundColor: 'transparent' }}>
              <QuestionCardStack
                questions={finalAvailableQuestions}
                deckCategory={deck?.category || 'friends'}
              />
            </View>
          </QuestionCardAnimationProvider>
        </QuestionStackAnimationProvider>
      </View>

      {/* Swipe Hint - First Time Only (Floating) */}
      {showSwipeHint && (
        <Animated.View 
          className="absolute bottom-24 left-6 right-6"
          style={{ opacity: hintOpacity }}
          pointerEvents="none"
        >
          <View className={`backdrop-blur-sm rounded-full py-4 px-8 border shadow-lg ${safeIsDark ? 'bg-white/30 border-white/30' : 'bg-white/80 border-white/30'}`}>
            <Text 
              className="text-center text-base font-medium text-gray-800 dark:text-white"
              style={{ fontWeight: '500' }}
            >
              Swipe left to skip • Swipe right to complete
            </Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
