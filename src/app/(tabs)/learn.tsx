// GoDeeper App - Learn Screen
// Resources for relationship growth: podcasts, articles, blogs, and social media

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Linking, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DeckBentoCard } from '@/components/cards';
import { StatusBar } from '@/components/ui';
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

export default function LearnScreen() {
  const { theme, isDark } = useTheme();
  const [navigatingToResource, setNavigatingToResource] = useState<string | null>(null);

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
      
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text 
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          style={{ letterSpacing: 0.5 }}
        >
          Learn
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-300">
          Resources to deepen your relationships
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

