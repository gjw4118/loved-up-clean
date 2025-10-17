// Thread Detail Screen - View and respond to shared question
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useQuestionThread } from '@/hooks/useQuestionThread';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/lib/auth/AuthContext';
import * as Haptics from 'expo-haptics';

export default function ThreadDetailScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { thread, isLoading, updateRecipient, submitResponse, isSubmitting } =
    useQuestionThread(threadId!);
  const [responseText, setResponseText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isSender = user && thread && thread.sender_id === user.id;
  const isRecipient = user && thread && thread.recipient_id === user.id;
  const needsToSetRecipient = user && thread && !thread.recipient_id && thread.sender_id !== user.id;

  // Set recipient when they first view the thread
  useEffect(() => {
    if (needsToSetRecipient) {
      updateRecipient();
    }
  }, [needsToSetRecipient]);

  const handleSubmit = async () => {
    if (!responseText.trim() || isSubmitting) return;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      submitResponse(responseText.trim());
      setResponseText('');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const canRespond = isRecipient && thread?.status === 'pending' && !submitted;
  const hasResponse = thread?.question_responses && thread.question_responses.length > 0;

  if (isLoading || !thread) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: isDark ? '#0F0F23' : '#F9FAFB' }}
      >
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  const question = thread.questions;
  const deckInfo = question?.question_decks;

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#0F0F23' : '#F9FAFB' }}>
      {/* Header */}
      <View
        className="pt-16 pb-4 px-6"
        style={{
          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text style={{ color: '#FF6B35', fontSize: 16 }}>← Back</Text>
        </TouchableOpacity>

        <Text className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
          {deckInfo?.name || 'Question'}
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerClassName="p-6">
          {/* Question Card */}
          <View
            className="mb-6 rounded-3xl overflow-hidden"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.4 : 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}
          >
            <LinearGradient
              colors={isDark ? ['#1a1a2e', '#16162a'] : ['#ffffff', '#f9fafb']}
              className="p-8"
            >
              <Text
                className="text-2xl font-semibold text-center leading-8"
                style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
              >
                {question?.text}
              </Text>
            </LinearGradient>
          </View>

          {/* Sender/Recipient Info */}
          <View className="mb-6">
            {isSender && (
              <View
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: isDark ? '#1a1a2e' : '#f3f4f6',
                }}
              >
                <Text
                  className="text-sm font-medium mb-1"
                  style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                >
                  Shared with
                </Text>
                <Text
                  className="text-lg font-semibold"
                  style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
                >
                  {thread.recipient?.display_name || thread.recipient_contact || 'Pending'}
                </Text>
              </View>
            )}
            {isRecipient && (
              <View
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: isDark ? '#1a1a2e' : '#f3f4f6',
                }}
              >
                <Text
                  className="text-sm font-medium mb-1"
                  style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                >
                  From
                </Text>
                <Text
                  className="text-lg font-semibold"
                  style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
                >
                  {thread.sender?.display_name || 'Someone'}
                </Text>
              </View>
            )}
          </View>

          {/* Response Section */}
          {hasResponse && (
            <View className="mb-6">
              <Text
                className="text-lg font-semibold mb-3"
                style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
              >
                Response
              </Text>
              <View
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
                  borderWidth: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <Text
                  className="text-base leading-6"
                  style={{ color: isDark ? '#e5e5e5' : '#1a1a1a' }}
                >
                  {thread.question_responses[0].response_text}
                </Text>
                <Text
                  className="text-sm mt-4"
                  style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}
                >
                  {new Date(thread.question_responses[0].created_at).toLocaleDateString()} at{' '}
                  {new Date(thread.question_responses[0].created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          )}

          {/* Waiting State for Sender */}
          {isSender && thread.status === 'pending' && !hasResponse && (
            <View
              className="p-6 rounded-2xl items-center"
              style={{
                backgroundColor: isDark ? '#1a1a2e' : '#f3f4f6',
              }}
            >
              <Text className="text-4xl mb-3">⏳</Text>
              <Text
                className="text-lg font-semibold mb-2"
                style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
              >
                Waiting for response
              </Text>
              <Text
                className="text-sm text-center"
                style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
              >
                They'll get a notification when they open the link
              </Text>
            </View>
          )}

          {/* Success State */}
          {submitted && (
            <View
              className="p-6 rounded-2xl items-center"
              style={{
                backgroundColor: '#10B98120',
                borderWidth: 1,
                borderColor: '#10B981',
              }}
            >
              <Text className="text-4xl mb-3">✅</Text>
              <Text className="text-lg font-semibold mb-2" style={{ color: '#10B981' }}>
                Response sent!
              </Text>
              <Text className="text-sm text-center" style={{ color: '#10B981' }}>
                They'll see your answer
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Response Input (only for recipients on pending threads) */}
        {canRespond && (
          <View
            className="p-4"
            style={{
              backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
              borderTopWidth: 1,
              borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            }}
          >
            <TextInput
              className="p-4 mb-3 rounded-xl text-base"
              style={{
                backgroundColor: isDark ? '#0F0F23' : '#f9fafb',
                color: isDark ? '#ffffff' : '#1a1a1a',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                minHeight: 100,
              }}
              placeholder="Write your response..."
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              multiline
              maxLength={1000}
              value={responseText}
              onChangeText={setResponseText}
              textAlignVertical="top"
            />

            <View className="flex-row justify-between items-center">
              <Text
                className="text-sm"
                style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}
              >
                {responseText.length}/1000
              </Text>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!responseText.trim() || isSubmitting}
                className="px-6 py-3 rounded-xl"
                style={{
                  backgroundColor:
                    !responseText.trim() || isSubmitting ? '#9CA3AF' : '#FF6B35',
                }}
              >
                <Text className="text-white text-base font-semibold">
                  {isSubmitting ? 'Sending...' : 'Send Response'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

