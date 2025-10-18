// GoDeeper App - Relationship Coach Screen
// Voice-powered AI coaching for relationship growth

import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mic, AlertCircle, Volume2, VolumeX } from 'lucide-react-native';

import { VoiceRecorder } from '@/components/coach/VoiceRecorder';
import { StatusBar } from '@/components/ui';
import { useCoachVoice, type CoachMode } from '@/hooks/useCoachVoice';
import { usePaywall } from '@/hooks/usePaywall';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { supabase } from '@/lib/database/supabase';

export default function CoachScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { isPremium, loading: premiumLoading } = usePremiumStatus();
  const { presentPaywall } = usePaywall();
  const [coachState, coachActions] = useCoachVoice();

  const suggestedQuestions = [
    'How can I improve communication with my partner?',
    'What are healthy boundaries in relationships?',
    'How do I express my needs without creating conflict?',
    'Help me understand attachment styles',
    'What does emotional intimacy actually mean?',
    'How do I know if my relationship is healthy?',
  ];

  const startSession = async () => {
    // Check premium status first
    if (!isPremium) {
      await presentPaywall('coach_feature');
      return;
    }

    if (!coachState.hasPermissions) {
      Alert.alert(
        'Microphone Permission Required',
        'Please enable microphone access in your device settings to use voice coaching.',
        [{ text: 'OK' }]
      );
      return;
    }

    await coachActions.startSession('guidance');
  };

  const handleSuggestedQuestion = async (question: string) => {
    if (!coachState.isActive) {
      await startSession();
      setTimeout(() => {
        coachActions.sendMessage(question);
      }, 1000);
    } else {
      await coachActions.sendMessage(question);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? '#000000' : '#fafafa' }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <LinearGradient
        colors={isDark 
          ? ['#000000', '#0a0a0a', '#000000'] 
          : ['#fafafa', '#ffffff', '#fafafa']
        }
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 24, 70) }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Relationship Coach
            </Text>
            
            {/* Premium Badge */}
            {!isPremium && !premiumLoading && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>
            )}
          </View>
          
          {/* Speaker Mode Toggle - Only show when active */}
          {coachState.isActive && (
            <TouchableOpacity
              onPress={coachActions.toggleSpeakerMode}
              style={[
                styles.speakerButton,
                {
                  backgroundColor: coachState.isSpeakerMode 
                    ? '#FF6B35'
                    : isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                }
              ]}
            >
              <View style={styles.speakerIcon}>
                <Text style={[
                  styles.speakerIconText,
                  { color: coachState.isSpeakerMode ? '#ffffff' : (isDark ? '#9CA3AF' : '#6B7280') }
                ]}>
                  {coachState.isSpeakerMode ? '♪' : '─'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Evidence-based guidance for healthier relationships
          </Text>
        </View>

        {/* Voice Interface */}
        <View style={styles.voiceInterface}>
          {coachState.isActive ? (
            <>
              <VoiceRecorder
                isRecording={coachState.isRecording}
                isPlaying={coachState.isPlaying}
                isProcessing={coachState.isProcessing}
                isPaused={false}
                audioLevel={coachState.audioLevel}
                onStartRecording={coachActions.startRecording}
                onStopRecording={coachActions.stopRecording}
                onPause={() => {}}
                onResume={() => {}}
                disabled={!coachState.hasPermissions}
              />
              
              <TouchableOpacity
                onPress={coachActions.endSession}
                style={[
                  styles.endSessionButton,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  }
                ]}
              >
                <Text style={[styles.endSessionText, { color: isDark ? '#ffffff' : '#000000' }]}>
                  End Session
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={startSession}
                activeOpacity={0.8}
                style={[
                  styles.startButton,
                  {
                    backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }
                ]}
              >
                <View style={[styles.micIconContainer, { backgroundColor: '#FF6B35' }]}>
                  <Mic size={48} color="#ffffff" strokeWidth={2} />
                </View>
                <Text style={[styles.startButtonText, { color: isDark ? '#ffffff' : '#000000' }]}>
                  Start Voice Session
                </Text>
                <Text style={[styles.startButtonHint, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                  Tap to begin
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Error Display */}
        {coachState.error && (
          <View style={styles.errorContainer}>
            <BlurView 
              intensity={isDark ? 30 : 20}
              tint={isDark ? 'dark' : 'light'}
              style={styles.errorCard}
            >
              <View style={styles.errorContent}>
                <AlertCircle size={20} color="#EF4444" style={{ marginRight: 12 }} />
                <Text style={[styles.errorText, { color: isDark ? '#ffffff' : '#000000', flex: 1 }]}>
                  {coachState.error}
                </Text>
                <TouchableOpacity onPress={coachActions.clearError}>
                  <Text style={[styles.errorDismiss, { color: '#FF6B35' }]}>
                    Dismiss
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        )}

        {/* Suggested Questions */}
        {!coachState.isActive && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Ways to Start
            </Text>

            {suggestedQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSuggestedQuestion(question)}
                disabled={coachState.isProcessing}
                style={[
                  styles.questionCard,
                  {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  }
                ]}
              >
                <Text style={[styles.questionText, { color: isDark ? '#ffffff' : '#000000' }]}>
                  {question}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 42,
    marginRight: 12,
  },
  premiumBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitleContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  speakerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  speakerIcon: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerIconText: {
    fontSize: 20,
    fontWeight: '600',
  },
  voiceInterface: {
    paddingHorizontal: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    maxWidth: 320,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  micIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  startButtonHint: {
    fontSize: 15,
  },
  endSessionButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  endSessionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  errorCard: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  errorDismiss: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  questionCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
