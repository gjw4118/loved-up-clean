// GoDeeper App - Relationship Coach Screen
// Voice-powered AI coaching for relationship growth

import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, StyleSheet, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { StatusBar } from '@/components/ui';
import { VoiceRecorder } from '@/components/coach/VoiceRecorder';
import { useCoachVoice, type CoachMode } from '@/hooks/useCoachVoice';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import { supabase } from '@/lib/database/supabase';

export default function CoachScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<CoachMode>('conversation');
  const [coachState, coachActions] = useCoachVoice();
  const [recentTopics, setRecentTopics] = useState<string[]>([]);

  // Load recent topics from database
  useEffect(() => {
    loadRecentTopics();
  }, []);

  const loadRecentTopics = async () => {
    try {
      if (!supabase || !user) {
        setRecentTopics([
          'Communication in conflict',
          'Building emotional intimacy',
          'Understanding love languages',
        ]);
        return;
      }

      const { data, error } = await supabase
        .from('coach_topics')
        .select('topic, coach_sessions!inner(user_id)')
        .eq('coach_sessions.user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error loading recent topics:', error);
      }
      
      if (data && data.length > 0) {
        setRecentTopics(data.map((t: any) => t.topic));
      } else {
        setRecentTopics([
          'Communication in conflict',
          'Building emotional intimacy',
          'Understanding love languages',
        ]);
      }
    } catch (error) {
      console.error('Failed to load recent topics:', error);
      setRecentTopics([
        'Communication in conflict',
        'Building emotional intimacy',
        'Understanding love languages',
      ]);
    }
  };

  const suggestedQuestions = [
    'How can I improve communication with my partner?',
    'What are healthy boundaries in relationships?',
    'How do I express my needs without conflict?',
    'Tell me about attachment styles in relationships',
  ];

  const toggleMode = async (newMode: CoachMode) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMode(newMode);
  };

  const startSession = async () => {
    if (!coachState.hasPermissions) {
      Alert.alert(
        'Microphone Permission Required',
        'Please enable microphone access in your device settings to use voice coaching.',
        [{ text: 'OK' }]
      );
      return;
    }
    await coachActions.startSession(mode);
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
        {/* Header with Speaker Toggle */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 24, 70) }]}>
          <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            Coach
          </Text>
          
          {/* Speaker Mode Toggle */}
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
            <Text style={{ fontSize: 20 }}>
              {coachState.isSpeakerMode ? '🔊' : '🔇'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggleContainer}>
          <View style={[
            styles.modeToggle,
            {
              backgroundColor: isDark 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)',
            }
          ]}>
            <TouchableOpacity
              onPress={() => toggleMode('conversation')}
              style={[
                styles.modeButton,
                mode === 'conversation' && {
                  backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                },
              ]}
            >
              <Text style={[
                styles.modeButtonText,
                {
                  color: mode === 'conversation'
                    ? (isDark ? '#ffffff' : '#000000')
                    : (isDark ? '#9CA3AF' : '#6B7280'),
                }
              ]}>
                Conversation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleMode('guidance')}
              style={[
                styles.modeButton,
                mode === 'guidance' && {
                  backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                },
              ]}
            >
              <Text style={[
                styles.modeButtonText,
                {
                  color: mode === 'guidance'
                    ? (isDark ? '#ffffff' : '#000000')
                    : (isDark ? '#9CA3AF' : '#6B7280'),
                }
              ]}>
                Guidance
              </Text>
            </TouchableOpacity>
          </View>
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
                style={styles.startButton}
              >
                <LinearGradient
                  colors={['#FF6B35', '#F7931E']}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={{ fontSize: 64 }}>🎙️</Text>
                <Text style={styles.startButtonText}>
                  Tap to Start
                </Text>
              </TouchableOpacity>

              <Text style={[styles.startDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {mode === 'conversation' 
                  ? 'Practice relationship conversations with AI feedback'
                  : 'Get personalized guidance on relationship growth'}
              </Text>
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
                <Text style={{ fontSize: 20, marginRight: 12 }}>⚠️</Text>
                <Text style={[styles.errorText, { color: isDark ? '#ffffff' : '#000000' }]}>
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

        {/* Recent Topics / Suggested Questions */}
        {mode === 'guidance' ? (
          <>
            {/* Recent Topics */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>🕒</Text>
                <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                  Recent Topics
                </Text>
              </View>

              {recentTopics.map((topic, index) => (
                <BlurView 
                  key={index}
                  intensity={isDark ? 20 : 15}
                  tint={isDark ? 'dark' : 'light'}
                  style={[styles.topicCard, { marginBottom: 12 }]}
                >
                  <LinearGradient
                    colors={isDark 
                      ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'] 
                      : ['rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.05)']
                    }
                    style={StyleSheet.absoluteFill}
                  />
                  <Text style={[styles.topicText, { color: isDark ? '#ffffff' : '#000000' }]}>
                    {topic}
                  </Text>
                </BlurView>
              ))}
            </View>

            {/* Suggested Questions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>💡</Text>
                <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                  Suggested Questions
                </Text>
              </View>

              {suggestedQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSuggestedQuestion(question)}
                  disabled={coachState.isProcessing}
                >
                  <BlurView 
                    intensity={isDark ? 20 : 15}
                    tint={isDark ? 'dark' : 'light'}
                    style={[styles.questionCard, { marginBottom: 12 }]}
                  >
                    <LinearGradient
                      colors={isDark 
                        ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'] 
                        : ['rgba(0, 0, 0, 0.02)', 'rgba(0, 0, 0, 0.05)']
                      }
                      style={StyleSheet.absoluteFill}
                    />
                    <Text style={{ fontSize: 16, marginRight: 12 }}>💬</Text>
                    <Text style={[styles.questionText, { color: isDark ? '#ffffff' : '#000000' }]}>
                      {question}
                    </Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          /* Conversation Mode Info */
          <View style={styles.section}>
            <BlurView 
              intensity={isDark ? 25 : 20}
              tint={isDark ? 'dark' : 'light'}
              style={styles.infoCard}
            >
              <LinearGradient
                colors={isDark 
                  ? ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)'] 
                  : ['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.08)']
                }
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                  Conversation Practice Mode
                </Text>
                
                <Text style={[styles.infoDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  I'll help you practice difficult conversations, explore your feelings, and improve your communication skills.
                </Text>

                <View style={[styles.tipsBox, { backgroundColor: 'rgba(255, 107, 53, 0.1)' }]}>
                  <Text style={[styles.tipsTitle, { color: '#FF6B35' }]}>
                    Tips for Best Results:
                  </Text>
                  <Text style={[styles.tipsText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                    • Speak naturally and honestly{'\n'}
                    • Take your time to think{'\n'}
                    • Ask for clarification if needed{'\n'}
                    • Practice what you'd like to say
                  </Text>
                </View>
              </View>
            </BlurView>
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
  modeToggleContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    width: '100%',
    maxWidth: 320,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  voiceInterface: {
    paddingHorizontal: 24,
    marginBottom: 40,
    alignItems: 'center',
  },
  startButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
  },
  startDescription: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 24,
    maxWidth: 280,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  topicCard: {
    borderRadius: 12,
    overflow: 'hidden',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  topicText: {
    fontSize: 16,
  },
  questionCard: {
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  questionText: {
    fontSize: 16,
    flex: 1,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoContent: {
    padding: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  tipsBox: {
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
