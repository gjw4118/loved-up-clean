// GoDeeper App - Relationship Coach Screen
// Voice-powered AI coaching for relationship growth

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusBar } from '@/components/ui';
import { useTheme } from '@/lib/contexts/ThemeContext';

export default function CoachScreen() {
  const { isDark } = useTheme();

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
      
      <ScrollView 
        className="flex-1"
        style={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 20 }}
      >
        {/* Header */}
        <View style={{ marginBottom: 40, alignItems: 'center' }}>
          <Text 
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ letterSpacing: 0.5, textAlign: 'center' }}
          >
            Coach
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-300 text-center">
            Voice-powered AI coaching for relationship growth
          </Text>
        </View>

        {/* Coming Soon Message */}
        <View style={styles.comingSoonContainer}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
          ]}>
            <Text style={{ fontSize: 48 }}>🎙️</Text>
          </View>
          
          <Text 
            className="text-2xl font-semibold text-gray-900 dark:text-white mb-3"
            style={{ textAlign: 'center' }}
          >
            Coming Soon
          </Text>
          
          <Text 
            className="text-base text-gray-600 dark:text-gray-300 mb-6"
            style={{ textAlign: 'center', lineHeight: 24 }}
          >
            We're building an intelligent AI coach to help you navigate relationship challenges,
            improve communication, and deepen your connections.
          </Text>

          <View style={[
            styles.featuresList,
            { 
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            }
          ]}>
            <Text 
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              What to expect:
            </Text>
            
            {[
              'Voice-powered conversations',
              'Personalized relationship guidance',
              'Communication practice sessions',
              'Emotional intelligence insights',
              'Conflict resolution strategies',
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={{ fontSize: 16, marginRight: 12 }}>✨</Text>
                <Text 
                  className="text-base text-gray-700 dark:text-gray-200"
                  style={{ flex: 1 }}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          <ActivityIndicator 
            size="small" 
            color={isDark ? '#ffffff' : '#000000'}
            style={{ marginTop: 24 }}
          />
          <Text 
            className="text-sm text-gray-500 dark:text-gray-400 mt-2"
            style={{ textAlign: 'center' }}
          >
            Setting up AI coaching...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  comingSoonContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  featuresList: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

