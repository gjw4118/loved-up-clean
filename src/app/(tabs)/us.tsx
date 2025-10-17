// Us Screen - View shared question threads
import { useTheme } from '@/lib/contexts/ThemeContext';
import { useSharedQuestions } from '@/hooks/useSharedQuestions';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/lib/auth/AuthContext';

export default function UsScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { threads, isLoading, refetch } = useSharedQuestions();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const getOtherPersonName = (thread: any) => {
    if (!user) return 'Unknown';
    
    const isSender = thread.sender_id === user.id;
    if (isSender) {
      return thread.recipient_name || thread.recipient_contact || 'Pending';
    } else {
      return thread.sender_name || 'Someone';
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

  const getStatusBadge = (thread: any) => {
    const isSender = user && thread.sender_id === user.id;
    
    if (thread.status === 'pending') {
      return isSender ? 'Waiting' : 'New';
    }
    return 'Answered';
  };

  const getStatusColor = (thread: any) => {
    if (thread.status === 'pending') {
      const isSender = user && thread.sender_id === user.id;
      return isSender ? '#9CA3AF' : '#FF6B35';
    }
    return '#10B981';
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
            const statusBadge = getStatusBadge(thread);
            const statusColor = getStatusColor(thread);

            return (
              <TouchableOpacity
                key={thread.thread_id || `thread-${index}`}
                onPress={() => router.push(`/threads/${thread.thread_id}`)}
                activeOpacity={0.7}
              >
                <View
                  className="mb-3 rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isDark ? 0.3 : 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <LinearGradient
                    colors={
                      isDark
                        ? ['#1a1a2e', '#16162a']
                        : ['#ffffff', '#f9fafb']
                    }
                    className="p-4"
                  >
                    <View className="flex-row items-start">
                      {/* Avatar */}
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

                      {/* Content */}
                      <View className="flex-1">
                        <View className="flex-row items-center justify-between mb-1">
                          <Text
                            className="text-lg font-semibold"
                            style={{ color: isDark ? '#ffffff' : '#1a1a1a' }}
                          >
                            {otherPersonName}
                          </Text>
                          
                          {/* Status Badge */}
                          <View
                            className="px-2 py-1 rounded-full"
                            style={{ backgroundColor: statusColor + '20' }}
                          >
                            <Text
                              className="text-xs font-semibold"
                              style={{ color: statusColor }}
                            >
                              {statusBadge}
                            </Text>
                          </View>
                        </View>

                        <Text
                          className="text-sm mb-2"
                          style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                          numberOfLines={2}
                        >
                          {thread.question_text}
                        </Text>

                        <Text
                          className="text-xs"
                          style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}
                        >
                          {thread.deck_name} · {new Date(thread.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

