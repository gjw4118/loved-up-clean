// Voice Recorder Component
// Provides UI for recording voice with visual feedback

import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { VoiceWaveform, WaveformState } from './VoiceWaveform';
import { useTheme } from '@/lib/contexts/ThemeContext';

interface VoiceRecorderProps {
  isRecording: boolean;
  isPlaying: boolean;
  isProcessing: boolean;
  isPaused: boolean;
  audioLevel: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPause: () => void;
  onResume: () => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  isPlaying,
  isProcessing,
  isPaused,
  audioLevel,
  onStartRecording,
  onStopRecording,
  onPause,
  onResume,
  disabled = false,
}) => {
  const { isDark } = useTheme();

  // Determine waveform state
  const getWaveformState = (): WaveformState => {
    if (isProcessing) return 'processing';
    if (isPlaying) return 'speaking';
    if (isRecording) return 'listening';
    return 'idle';
  };

  // Get status text
  const getStatusText = () => {
    if (isPaused) return 'Session Paused';
    if (isProcessing) return 'Processing your message...';
    if (isPlaying) return 'Coach is speaking...';
    if (isRecording) return 'Listening... Tap to finish';
    return 'Tap to start speaking';
  };

  // Get status color
  const getStatusColor = () => {
    if (isPaused) return '#F59E0B';
    if (isProcessing) return '#F59E0B';
    if (isPlaying) return '#3B82F6';
    if (isRecording) return '#10B981';
    return isDark ? '#9CA3AF' : '#6B7280';
  };

  return (
    <View style={styles.container}>
      {/* Central Waveform Display */}
      <View style={styles.waveformContainer}>
        <VoiceWaveform
          state={getWaveformState()}
          audioLevel={audioLevel}
          size={200}
        />
      </View>

      {/* Status Text */}
      <View style={styles.statusContainer}>
        <Text 
          style={[
            styles.statusText,
            { color: getStatusColor() }
          ]}
        >
          {getStatusText()}
        </Text>
        
        {isRecording && (
          <Text style={[styles.hintText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Release to stop and send
          </Text>
        )}
      </View>

      {/* Recording Controls */}
      <View style={styles.controlsContainer}>
        {!isPaused ? (
          <>
            {/* Main Recording Button */}
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
                (disabled || isProcessing || isPlaying) && styles.recordButtonDisabled,
              ]}
              onPress={isRecording ? onStopRecording : onStartRecording}
              disabled={disabled || isProcessing || isPlaying}
              activeOpacity={0.8}
            >
              <BlurView 
                intensity={20}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={isRecording 
                  ? ['#EF4444', '#DC2626'] 
                  : ['#3B82F6', '#2563EB']
                }
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.micIconContainer}>
                {isRecording ? (
                  <View style={styles.stopIcon} />
                ) : (
                  <Text style={styles.micIcon}>🎙️</Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Pause Button */}
            <TouchableOpacity
              onPress={onPause}
              disabled={disabled}
              style={[
                styles.pauseButton,
                {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                }
              ]}
            >
              <Text style={[styles.pauseText, { color: isDark ? '#ffffff' : '#000000' }]}>
                Pause Session
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          /* Resume Controls */
          <View style={styles.pausedControls}>
            <TouchableOpacity
              onPress={onResume}
              style={[styles.resumeButton]}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.resumeText}>
                Resume Session
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Audio Level Indicator */}
      {isRecording && (
        <View style={styles.audioLevelContainer}>
          <Text style={[styles.audioLevelLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            Audio Level
          </Text>
          <View style={[
            styles.audioLevelBar,
            { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
          ]}>
            <View 
              style={[
                styles.audioLevelFill,
                { width: `${Math.max(5, audioLevel * 100)}%` }
              ]} 
            />
          </View>
        </View>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <View style={styles.timerContainer}>
          <View style={styles.recordingIndicator} />
          <Text style={styles.timerText}>
            Recording...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  waveformContainer: {
    marginBottom: 32,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  statusText: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  controlsContainer: {
    alignItems: 'center',
    gap: 16,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonActive: {
    transform: [{ scale: 1.1 }],
  },
  recordButtonDisabled: {
    opacity: 0.5,
  },
  micIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    fontSize: 32,
  },
  stopIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  pauseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pausedControls: {
    alignItems: 'center',
  },
  resumeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  resumeText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  audioLevelContainer: {
    alignItems: 'center',
    marginTop: 24,
    width: 200,
  },
  audioLevelLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  audioLevelBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  audioLevelFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2,
    minWidth: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  recordingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
});

