// Us Screen - View shared question threads
import { LinearGradient, StatusBar } from '@/components/ui';
import { useSharedQuestions } from '@/hooks/useSharedQuestions';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { supabase } from '@/lib/database/supabase';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UsScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { threads, isLoading, refetch } = useSharedQuestions();
  const [refreshing, setRefreshing] = useState(false);
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
      <View style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </View>
    );
  };

  const ThreadCard = ({ children }: { children: React.ReactNode }) => (
    <BlurView 
      intensity={isDark ? 30 : 20}
      tint={isDark ? 'dark' : 'light'}
      style={styles.card}
    >
      <LinearGradient
        colors={isDark 
          ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'] 
          : ['rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.05)']
        }
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cardContent}>
        {children}
      </View>
    </BlurView>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a855f7" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <LinearGradient
        colors={isDark 
          ? ['#000000', '#0a0a0a', '#1a0a1f'] 
          : ['#fafafa', '#ffffff', '#f5f3ff']
        }
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#a855f7"
          />
        }
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, isDark && styles.titleDark]}>Us</Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              Shared questions and responses
            </Text>
          </View>

          {threads.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={[styles.emptyTitle, isDark && styles.emptyTitleDark]}>
                No shared questions yet
              </Text>
              <Text style={[styles.emptySubtitle, isDark && styles.emptySubtitleDark]}>
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
                  onSwipeableOpen={() => confirmDelete(thread.thread_id)}
                >
                  <ThreadCard>
                    <View style={[styles.threadContent, isDeleting && styles.threadDeleting]}>
                      {/* Header: Avatar + Name + Badge */}
                      <View style={styles.threadHeader}>
                        {/* Gradient Avatar */}
                        <LinearGradient
                          colors={['#f97316', '#ec4899', '#a855f7']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.avatar}
                        >
                          <Text style={styles.avatarText}>{initials}</Text>
                        </LinearGradient>

                        <View style={styles.threadInfo}>
                          <View style={styles.nameRow}>
                            <Text style={[styles.name, isDark && styles.nameDark]}>
                              {otherPersonName}
                            </Text>
                            
                            {/* Status Badge */}
                            <View style={[
                              styles.badge,
                              isPending 
                                ? (isSender(thread) ? styles.badgeWaiting : styles.badgeNew)
                                : styles.badgeAnswered
                            ]}>
                              <Text style={[
                                styles.badgeText,
                                isPending 
                                  ? (isSender(thread) ? styles.badgeTextWaiting : styles.badgeTextNew)
                                  : styles.badgeTextAnswered
                              ]}>
                                {isPending 
                                  ? (isSender(thread) ? 'Waiting' : 'New')
                                  : 'Answered'}
                              </Text>
                            </View>
                          </View>
                          
                          <Text style={[styles.metadata, isDark && styles.metadataDark]}>
                            {thread.questions?.question_decks?.name || 'Question'} · {new Date(thread.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>

                      {/* Question */}
                      <View style={styles.section}>
                        <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
                          QUESTION
                        </Text>
                        <View style={[styles.textBox, isDark && styles.textBoxDark]}>
                          <Text style={[styles.questionText, isDark && styles.questionTextDark]}>
                            {thread.questions?.text}
                          </Text>
                        </View>
                      </View>

                      {/* Response (if answered) */}
                      {!isPending && response && (
                        <View style={styles.section}>
                          <Text style={[styles.sectionLabel, isDark && styles.sectionLabelDark]}>
                            RESPONSE
                          </Text>
                          <View style={[styles.responseBox, isDark && styles.responseBoxDark]}>
                            <Text style={[styles.responseText, isDark && styles.responseTextDark]}>
                              {response.response_text}
                            </Text>
                            <Text style={[styles.timestamp, isDark && styles.timestampDark]}>
                              {new Date(response.created_at).toLocaleDateString()} at{' '}
                              {new Date(response.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </ThreadCard>
                </Swipeable>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  titleDark: {
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  subtitleDark: {
    color: '#9ca3af',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyTitleDark: {
    color: '#ffffff',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptySubtitleDark: {
    color: '#9ca3af',
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  cardContent: {
    padding: 20,
  },
  threadContent: {
    gap: 16,
  },
  threadDeleting: {
    opacity: 0.5,
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  threadInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  nameDark: {
    color: '#ffffff',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeWaiting: {
    backgroundColor: 'rgba(156, 163, 175, 0.15)',
  },
  badgeNew: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
  },
  badgeAnswered: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextWaiting: {
    color: '#9ca3af',
  },
  badgeTextNew: {
    color: '#FF6B35',
  },
  badgeTextAnswered: {
    color: '#10b981',
  },
  metadata: {
    fontSize: 13,
    color: '#9ca3af',
  },
  metadataDark: {
    color: '#6b7280',
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 0.5,
  },
  sectionLabelDark: {
    color: '#6b7280',
  },
  textBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    padding: 12,
    borderRadius: 12,
  },
  textBoxDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  questionText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#374151',
  },
  questionTextDark: {
    color: '#e5e7eb',
  },
  responseBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  responseBoxDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  responseText: {
    fontSize: 15,
    lineHeight: 21,
    color: '#111827',
    marginBottom: 8,
  },
  responseTextDark: {
    color: '#ffffff',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
  },
  timestampDark: {
    color: '#6b7280',
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    marginBottom: 16,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
