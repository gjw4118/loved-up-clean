// GoDeeper App - More Screen
// Profile access and resources for relationship growth

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import { DeckBentoCard } from '@/components/cards';
import { StatusBar } from '@/components/ui';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';

// Define resource types
type ResourceType = 'podcast' | 'website' | 'blog' | 'social';

interface Resource {
  id: string;
  name: string;
  description: string;
  type: ResourceType;
  icon: string;
  gradient: string[];
  url?: string;
  isComingSoon: boolean;
  image?: any;
}

// Dummy resources with "coming soon" status
const LEARNING_RESOURCES: Resource[] = [
  {
    id: 'gottman-institute',
    name: 'Gottman Institute',
    description: 'Research-based relationship advice from leading experts',
    type: 'website',
    icon: '📚',
    gradient: ['#667eea', '#764ba2'],
    isComingSoon: true,
  },
  {
    id: 'esther-perel',
    name: 'Where Should We Begin?',
    description: 'Podcast by Esther Perel on modern relationships',
    type: 'podcast',
    icon: '🎙️',
    gradient: ['#f093fb', '#f5576c'],
    isComingSoon: true,
  },
  {
    id: 'relationship-goals',
    name: 'Relationship Goals',
    description: 'Building healthy relationships with Michael Todd',
    type: 'podcast',
    icon: '🎧',
    gradient: ['#4facfe', '#00f2fe'],
    isComingSoon: true,
  },
  {
    id: 'therapist-insights',
    name: 'Therapist Insights',
    description: 'Professional guidance for couples and individuals',
    type: 'blog',
    icon: '✍️',
    gradient: ['#43e97b', '#38f9d7'],
    isComingSoon: true,
  },
  {
    id: 'love-languages',
    name: 'The 5 Love Languages',
    description: 'Understanding how we give and receive love',
    type: 'website',
    icon: '💝',
    gradient: ['#fa709a', '#fee140'],
    isComingSoon: true,
  },
  {
    id: 'relationship-coach',
    name: 'Relationship Coach',
    description: 'Daily tips for stronger connections',
    type: 'social',
    icon: '📱',
    gradient: ['#30cfd0', '#330867'],
    isComingSoon: true,
  },
  {
    id: 'couples-therapy',
    name: 'Couples Therapy Podcast',
    description: 'Real couples, real sessions, real growth',
    type: 'podcast',
    icon: '🎙️',
    gradient: ['#a8edea', '#fed6e3'],
    isComingSoon: true,
  },
  {
    id: 'attachment-theory',
    name: 'Attachment Theory',
    description: 'Understanding your relationship patterns',
    type: 'blog',
    icon: '🧠',
    gradient: ['#ff9a9e', '#fecfef'],
    isComingSoon: true,
  },
  {
    id: 'date-night-ideas',
    name: 'Date Night Ideas',
    description: 'Creative ways to keep the spark alive',
    type: 'social',
    icon: '💡',
    gradient: ['#ffecd2', '#fcb69f'],
    isComingSoon: true,
  },
];

export default function MoreScreen() {
  const { theme, isDark } = useTheme();
  const { user, profile } = useAuth();
  const [navigatingToResource, setNavigatingToResource] = useState<string | null>(null);

  const getInitial = () => {
    if (profile?.first_name) {
      return profile.first_name[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const handleProfilePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/settings');
  };

  const handleResourceSelect = async (resource: Resource) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Handle coming soon resources
    if (resource.isComingSoon) {
      // Don't navigate, just show haptic feedback
      return;
    }
    
    // For future implementation: open the resource URL
    if (resource.url) {
      setNavigatingToResource(resource.id);
      try {
        const canOpen = await Linking.canOpenURL(resource.url);
        if (canOpen) {
          await Linking.openURL(resource.url);
        } else {
          Alert.alert('Error', 'Unable to open this resource');
        }
      } catch (error) {
        console.error('Error opening resource:', error);
        Alert.alert('Error', 'Something went wrong opening this resource');
      } finally {
        setNavigatingToResource(null);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient
        colors={isDark 
          ? ['#000000', '#0a0a0a', '#000000'] 
          : ['#fafafa', '#ffffff', '#fafafa']
        }
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Profile Header */}
      <Pressable onPress={handleProfilePress} style={styles.profileHeader}>
        <BlurView 
          intensity={isDark ? 30 : 20}
          tint={isDark ? 'dark' : 'light'}
          style={styles.profileCard}
        >
          <LinearGradient
            colors={isDark 
              ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'] 
              : ['rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.05)']
            }
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.profileContent}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{getInitial()}</Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: isDark ? '#ffffff' : '#000000' }]}>
                {getName()}
              </Text>
              <Text style={[styles.profileEmail, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {user?.email || 'View profile'}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>›</Text>
          </View>
        </BlurView>
      </Pressable>

      {/* Resources Section Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 }}>
        <Text 
          className="text-2xl font-bold text-gray-900 dark:text-white mb-1"
          style={{ letterSpacing: 0.5 }}
        >
          Resources
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-300">
          Explore content to deepen your relationships
        </Text>
      </View>

      <ScrollView 
        className="flex-1"
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Bento Grid Layout */}
        <View style={{ gap: 16 }}>
          {/* Row 1: Two medium cards */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <DeckBentoCard
                deck={LEARNING_RESOURCES[0]}
                onPress={() => handleResourceSelect(LEARNING_RESOURCES[0])}
                size="medium"
                isDark={isDark}
                isNavigating={navigatingToResource === LEARNING_RESOURCES[0].id}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DeckBentoCard
                deck={LEARNING_RESOURCES[1]}
                onPress={() => handleResourceSelect(LEARNING_RESOURCES[1])}
                size="medium"
                isDark={isDark}
                isNavigating={navigatingToResource === LEARNING_RESOURCES[1].id}
              />
            </View>
          </View>

          {/* Row 2: One large card (Featured) */}
          <View>
            <DeckBentoCard
              deck={LEARNING_RESOURCES[2]}
              onPress={() => handleResourceSelect(LEARNING_RESOURCES[2])}
              size="large"
              isDark={isDark}
              isNavigating={navigatingToResource === LEARNING_RESOURCES[2].id}
            />
          </View>

          {/* Row 3: Two medium cards */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <DeckBentoCard
                deck={LEARNING_RESOURCES[3]}
                onPress={() => handleResourceSelect(LEARNING_RESOURCES[3])}
                size="medium"
                isDark={isDark}
                isNavigating={navigatingToResource === LEARNING_RESOURCES[3].id}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DeckBentoCard
                deck={LEARNING_RESOURCES[4]}
                onPress={() => handleResourceSelect(LEARNING_RESOURCES[4])}
                size="medium"
                isDark={isDark}
                isNavigating={navigatingToResource === LEARNING_RESOURCES[4].id}
              />
            </View>
          </View>

          {/* Row 4: Two medium cards */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <DeckBentoCard
                deck={LEARNING_RESOURCES[5]}
                onPress={() => handleResourceSelect(LEARNING_RESOURCES[5])}
                size="medium"
                isDark={isDark}
                isNavigating={navigatingToResource === LEARNING_RESOURCES[5].id}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DeckBentoCard
                deck={LEARNING_RESOURCES[6]}
                onPress={() => handleResourceSelect(LEARNING_RESOURCES[6])}
                size="medium"
                isDark={isDark}
                isNavigating={navigatingToResource === LEARNING_RESOURCES[6].id}
              />
            </View>
          </View>

          {/* Row 5: Two medium cards */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <DeckBentoCard
                deck={LEARNING_RESOURCES[7]}
                onPress={() => handleResourceSelect(LEARNING_RESOURCES[7])}
                size="medium"
                isDark={isDark}
                isNavigating={navigatingToResource === LEARNING_RESOURCES[7].id}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DeckBentoCard
                deck={LEARNING_RESOURCES[8]}
                onPress={() => handleResourceSelect(LEARNING_RESOURCES[8])}
                size="medium"
                isDark={isDark}
                isNavigating={navigatingToResource === LEARNING_RESOURCES[8].id}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 28,
    fontWeight: '300',
  },
});
