// Us Screen - View shared question threads
import { useAuth } from '@/lib/auth/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useSharedQuestions } from '@/hooks/useSharedQuestions';
import { supabase } from '@/lib/database/supabase';
import { Accordion, Card, Chip } from 'heroui-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

export default function UsScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { threads, isLoading, refetch } = useSharedQuestions();
  const [refreshing, setRefreshing] = React.useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const getOtherPersonName = (thread: any) => {
    if (!user) return 'Unknown';
    
    const isSender = thread.sender_id === user.id;
    if (isSender) {
      return thread.recipient?.display_name || thread.recipient_contact || 'Pending';
    } else {
      return thread.sender?.display_name || 'Someone';
    }
  };

  const getInitials = (name: string) => {
    if (!name || name === 'Pending' || name === 'Unknown') return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isSender = (thread: any) => {
    return user && thread.sender_id === user.id;
  };

  const deleteThread = async (threadId: string) => {
    if (!supabase) return;
    
    try {
      setDeletingIds(prev => new Set(prev).add(threadId));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const { error } = await supabase
        .from('question_threads')
        .delete()
        .eq('id', threadId);

      if (error) throw error;

      await refetch();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error deleting thread:', error);
      Alert.alert('Error', 'Failed to delete conversation');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(threadId);
        return next;
      });
    }
  };

  const confirmDelete = (threadId: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteThread(threadId)
        },
      ]
    );
  };

  const renderRightActions = (threadId: string) => {
    return (
      <TouchableOpacity
        onPress={() => confirmDelete(threadId)}
        className="justify-center items-center px-6 rounded-r-2xl"
        style={{ backgroundColor: '#EF4444' }}
      >
        <Text className="text-white font-semibold">Delete</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: isDark ? '#0F0F23' : '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: isDark ? '#0F0F23' : '#F9FAFB' }}>
      {/* Header */}
      <View 
        className="pt-16 pb-6 px-6"
        style={{
          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        }}
      >
        <Text 
          className="text-3xl font-bold"
          style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
        >
          Us
        </Text>
        <Text 
          className="text-base mt-1"
          style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
        >
          Shared questions and responses
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B35" />
        }
      >
        {threads.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-6xl mb-4">💬</Text>
            <Text 
              className="text-xl font-semibold mb-2"
              style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
            >
              No shared questions yet
            </Text>
            <Text 
              className="text-base text-center px-8"
              style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
            >
              Long press on any question card to share it with someone
            </Text>
          </View>
        ) : (
          threads.map((thread: any, index: number) => {
            const otherPersonName = getOtherPersonName(thread);
            const initials = getInitials(otherPersonName);
            const isPending = thread.status === 'pending';
            const isDeleting = deletingIds.has(thread.thread_id);
            const response = thread.question_responses?.[0];

            return (
              <Swipeable
                key={thread.thread_id || `thread-${index}`}
                renderRightActions={() => renderRightActions(thread.thread_id)}
                friction={2}
                enabled={!isDeleting}
              >
                <Card
                  className="mb-3"
                  style={{
                    opacity: isDeleting ? 0.5 : 1,
                    backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
                  }}
                >
                  {/* Pending Question - Simple Card */}
                  {isPending ? (
                    <TouchableOpacity
                      onPress={() => router.push(`/threads/${thread.thread_id}`)}
                      activeOpacity={0.7}
                      disabled={isDeleting}
                    >
                      <View className="p-4">
                        <View className="flex-row items-center justify-between mb-3">
                          {/* Avatar */}
                          <View className="flex-row items-center flex-1">
                            <View
                              className="w-12 h-12 rounded-full items-center justify-center mr-3"
                              style={{
                                backgroundColor: isDark ? '#2d2d4a' : '#e5e7eb',
                              }}
                            >
                              <Text
                                className="text-lg font-bold"
                                style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
                              >
                                {initials}
                              </Text>
                            </View>

                            <View className="flex-1">
                              <Text
                                className="text-lg font-semibold mb-1"
                                style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
                              >
                                {otherPersonName}
                              </Text>
                              <Text
                                className="text-xs"
                                style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}
                              >
                                {thread.questions?.question_decks?.name || 'Question'} · {new Date(thread.created_at).toLocaleDateString()}
                              </Text>
                            </View>
                          </View>

                          {/* Status Badge */}
                          <Chip 
                            size="sm"
                            style={{
                              backgroundColor: isSender(thread) ? '#9CA3AF20' : '#FF6B3520',
                              borderColor: isSender(thread) ? '#9CA3AF' : '#FF6B35',
                            }}
                          >
                            <Text
                              className="text-xs font-semibold"
                              style={{ color: isSender(thread) ? '#9CA3AF' : '#FF6B35' }}
                            >
                              {isSender(thread) ? 'Waiting' : 'New'}
                            </Text>
                          </Chip>
                        </View>

                        {/* Question Text */}
                        <View
                          className="p-3 rounded-xl"
                          style={{
                            backgroundColor: isDark ? '#16162a' : '#f9fafb',
                          }}
                        >
                          <Text
                            className="text-sm leading-5"
                            style={{ color: isDark ? '#e5e5e5' : '#4b5563' }}
                            numberOfLines={2}
                          >
                            {thread.questions?.text}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    /* Answered Question - Accordion */
                    <Accordion
                      type="single"
                      className="border-0"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <Accordion.Item value={`thread-${thread.thread_id}`}>
                        <Accordion.Header className="px-4 pt-4 pb-2">
                          <View className="flex-row items-center justify-between flex-1">
                            {/* Avatar */}
                            <View className="flex-row items-center flex-1">
                              <View
                                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                                style={{
                                  backgroundColor: isDark ? '#2d2d4a' : '#e5e7eb',
                                }}
                              >
                                <Text
                                  className="text-lg font-bold"
                                  style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
                                >
                                  {initials}
                                </Text>
                              </View>

                              <View className="flex-1">
                                <Text
                                  className="text-lg font-semibold mb-1"
                                  style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
                                >
                                  {otherPersonName}
                                </Text>
                                <Text
                                  className="text-xs"
                                  style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}
                                >
                                  {thread.questions?.question_decks?.name || 'Question'} · {new Date(thread.created_at).toLocaleDateString()}
                                </Text>
                              </View>
                            </View>

                            {/* Answered Badge */}
                            <Chip 
                              size="sm"
                              style={{
                                backgroundColor: '#10B98120',
                                borderColor: '#10B981',
                                marginRight: 8,
                              }}
                            >
                              <Text
                                className="text-xs font-semibold"
                                style={{ color: '#10B981' }}
                              >
                                Answered
                              </Text>
                            </Chip>
                          </View>
                        </Accordion.Header>

                        <Accordion.Content className="px-4 pb-4">
                          {/* Question */}
                          <View className="mb-3">
                            <Text
                              className="text-xs font-semibold mb-2"
                              style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                            >
                              QUESTION
                            </Text>
                            <View
                              className="p-3 rounded-xl"
                              style={{
                                backgroundColor: isDark ? '#16162a' : '#f9fafb',
                              }}
                            >
                              <Text
                                className="text-sm leading-5"
                                style={{ color: isDark ? '#e5e5e5' : '#4b5563' }}
                              >
                                {thread.questions?.text}
                              </Text>
                            </View>
                          </View>

                          {/* Response */}
                          {response && (
                            <View>
                              <Text
                                className="text-xs font-semibold mb-2"
                                style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                              >
                                RESPONSE
                              </Text>
                              <View
                                className="p-3 rounded-xl"
                                style={{
                                  backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
                                  borderWidth: 1,
                                  borderColor: isDark ? '#10B98140' : '#10B98120',
                                }}
                              >
                                <Text
                                  className="text-sm leading-5 mb-2"
                                  style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
                                >
                                  {response.response_text}
                                </Text>
                                <Text
                                  className="text-xs"
                                  style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}
                                >
                                  {new Date(response.created_at).toLocaleDateString()} at{' '}
                                  {new Date(response.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </Text>
                              </View>
                            </View>
                          )}
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion>
                  )}
                </Card>
              </Swipeable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
