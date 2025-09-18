// Connect App - Shared Questions Screen
// View and manage shared questions

import { Button, Card, Chip } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function SharedScreen() {
  const { theme, isDark } = useTheme();

  // Mock shared questions data - will be replaced with real data
  const sharedQuestions = [
    {
      id: '1',
      text: "What's the most adventurous thing you've ever done?",
      deck: 'Friends',
      sharedBy: 'Sarah',
      sharedAt: '2 hours ago',
      sharedVia: 'iMessage'
    },
    {
      id: '2', 
      text: "What's your favorite memory of us together?",
      deck: 'Lovers',
      sharedBy: 'Mike',
      sharedAt: '1 day ago',
      sharedVia: 'Link'
    },
    {
      id: '3',
      text: "What's something you're grateful for about our family?",
      deck: 'Family', 
      sharedBy: 'Mom',
      sharedAt: '3 days ago',
      sharedVia: 'iMessage'
    }
  ];

  const handleQuestionPress = async (questionId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Open question:', questionId);
    // TODO: Navigate to question detail or start conversation
  };

  const handleShareQuestion = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Share a question');
    // TODO: Implement share functionality
  };

  const handleBrowseDecks = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)'); // Navigate to decks (index)
  };

  return (
    <SafeAreaView className="flex-1 bg-content2">
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Card 
          className="mb-6 bg-content1"
          radius="xl"
          shadow="lg"
        >
          <Card.Body className="p-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-3xl font-bold text-foreground mb-2">
                  📤 Shared Questions
                </Text>
                <Text className="text-foreground/70 text-base">
                  {sharedQuestions.length} questions shared with you
                </Text>
              </View>
              <View 
                className="bg-primary/20 rounded-full p-4"
                style={{
                  shadowColor: '#007AFF',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text className="text-2xl">💬</Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        {/* Shared Questions List */}
        {sharedQuestions.length > 0 ? (
          <View className="space-y-4 mb-8">
            {sharedQuestions.map((question) => (
              <Card 
                key={question.id}
                isPressable
                onPress={() => handleQuestionPress(question.id)}
                className="bg-content1"
                radius="lg"
                shadow="md"
              >
                <Card.Body className="p-5">
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1">
                      <Text className="text-foreground font-medium text-base leading-6 mb-2">
                        {question.text}
                      </Text>
                      <View className="flex-row items-center">
                        <Chip size="sm" color="primary" variant="flat" className="mr-2">
                          {question.deck}
                        </Chip>
                        <Text className="text-foreground/50 text-xs">
                          from {question.sharedBy} • {question.sharedAt}
                        </Text>
                      </View>
                    </View>
                    
                    <View className="ml-3">
                      <Text className="text-foreground/40 text-xs">
                        {question.sharedVia === 'iMessage' ? '💬' : '🔗'}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center justify-between">
                    <Text className="text-primary text-sm font-medium">
                      Tap to start conversation
                    </Text>
                    <Text className="text-foreground/40">→</Text>
                  </View>
                </Card.Body>
              </Card>
            ))}
          </View>
        ) : (
          /* Empty State */
          <Card className="p-8 mb-8 bg-content2">
            <Card.Body className="items-center">
              <Text className="text-6xl mb-4">📤</Text>
              <Text className="text-xl font-bold text-foreground mb-3">
                No Shared Questions Yet
              </Text>
              <Text className="text-foreground/70 text-center mb-6 leading-6">
                When friends share questions with you, they'll appear here for easy access
              </Text>
              
              <Button
                onPress={handleShareQuestion}
                color="primary"
                size="lg"
                className="w-full mb-4"
              >
                Share a Question
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Quick Actions */}
        <View className="gap-3 mb-8">
          <Button
            onPress={handleShareQuestion}
            variant="bordered"
            size="lg"
            className="w-full"
          >
            Share New Question
          </Button>
          
          <Button
            onPress={handleBrowseDecks}
            variant="bordered"
            size="lg"
            className="w-full"
          >
            Browse All Questions
          </Button>
        </View>

        {/* Bottom spacing for tab bar */}
        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
