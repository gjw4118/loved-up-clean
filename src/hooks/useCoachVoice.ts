import { aiVoiceService } from '@/lib/ai/voice-service';
import { supabase } from '@/lib/database/supabase';
import type { CoachMessage, CoachMode, CoachVoiceActions, CoachVoiceState } from '@/types/coach';
import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

export { type CoachMode } from '@/types/coach';

export const useCoachVoice = (): [CoachVoiceState, CoachVoiceActions] => {
  // State management
  const [state, setState] = useState<CoachVoiceState>({
    isActive: false,
    mode: 'conversation',
    isRecording: false,
    isPlaying: false,
    isProcessing: false,
    isSpeakerMode: true,
    conversationHistory: [],
    currentMessage: '',
    audioLevel: 0,
    error: null,
    hasPermissions: false,
    sessionId: null,
  });

  // Refs for audio management
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const audioLevelInterval = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTime = useRef<Date | null>(null);
  const autoRecordTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio permissions
  useEffect(() => {
    setupAudio();
    return () => {
      setState(prev => ({
        ...prev,
        isPlaying: false,
        isRecording: false,
        isProcessing: false,
        isActive: false,
      }));
      cleanup();
    };
  }, []);

  const setupAudio = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      
      if (!granted) {
        setState(prev => ({
          ...prev,
          hasPermissions: false,
          error: 'Microphone permission is required for voice coaching.',
        }));
        return;
      }

      const audioModeConfig = {
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        interruptionModeIOS: 2,
        interruptionModeAndroid: 1,
      };
      
      await Audio.setAudioModeAsync(audioModeConfig);
      setState(prev => ({ ...prev, hasPermissions: true }));
      console.log('🔊 Audio configured: Speaker mode enabled');
    } catch (error) {
      console.error('Audio setup error:', error);
      setState(prev => ({
        ...prev,
        hasPermissions: false,
        error: 'Failed to setup audio. Please restart the app.',
      }));
    }
  };

  const cleanup = async () => {
    try {
      if (autoRecordTimeoutRef.current) {
        clearTimeout(autoRecordTimeoutRef.current);
        autoRecordTimeoutRef.current = null;
      }

      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
        } catch (e) {
          console.log('Recording already stopped');
        }
        recordingRef.current = null;
      }

      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        } catch (e) {
          console.log('Sound already stopped');
        }
        soundRef.current = null;
      }

      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current);
        audioLevelInterval.current = null;
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  };

  const startSession = useCallback(async (mode: CoachMode) => {
    if (!state.hasPermissions) {
      Alert.alert('Permissions Required', 'Please enable microphone access to start coaching.');
      return;
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: session, error } = await supabase
        .from('coach_sessions')
        .insert({
          user_id: user.id,
          mode,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      sessionStartTime.current = new Date();

      setState(prev => ({
        ...prev,
        isActive: true,
        mode,
        sessionId: session.id,
        conversationHistory: [],
        error: null,
      }));

      const greeting = mode === 'conversation'
        ? "Hello! I'm here to help you with relationship conversations. What would you like to talk about?"
        : "Hi! I'm your relationship coach. How can I support your relationship growth today?";
      
      await playAIResponse(greeting);

    } catch (error: any) {
      console.error('Start session error:', error);
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to start coaching session',
      }));
    }
  }, [state.hasPermissions]);

  const endSession = useCallback(async () => {
    console.log('🛑 Ending coaching session...');
    
    if (autoRecordTimeoutRef.current) {
      clearTimeout(autoRecordTimeoutRef.current);
      autoRecordTimeoutRef.current = null;
    }
    
    try {
      if (state.sessionId && sessionStartTime.current && supabase) {
        const duration = Math.floor((Date.now() - sessionStartTime.current.getTime()) / 1000);
        
        await supabase
          .from('coach_sessions')
          .update({
            ended_at: new Date().toISOString(),
            duration_seconds: duration,
            transcript: state.conversationHistory,
          })
          .eq('id', state.sessionId);

        if (state.conversationHistory.length > 0) {
          const firstUserMessage = state.conversationHistory.find(m => m.role === 'user');
          if (firstUserMessage) {
            await supabase
              .from('coach_topics')
              .insert({
                session_id: state.sessionId,
                topic: firstUserMessage.content.substring(0, 100),
              });
          }
        }
      }

      await cleanup();
      
      setState(prev => ({
        ...prev,
        isActive: false,
        isRecording: false,
        isPlaying: false,
        isProcessing: false,
        sessionId: null,
        conversationHistory: [],
      }));

      sessionStartTime.current = null;
      console.log('🛑 Session ended');

    } catch (error) {
      console.error('End session error:', error);
    }
  }, [state.sessionId, state.conversationHistory]);

  const startRecording = useCallback(async () => {
    let canRecord = false;
    setState(prev => {
      canRecord = prev.hasPermissions && !prev.isRecording && !prev.isPlaying && !prev.isProcessing;
      return prev;
    });

    if (!canRecord) {
      console.log('⏭️ Cannot start recording');
      return;
    }

    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      console.log('▶️ Starting recording...');
      setState(prev => ({ ...prev, isRecording: true, error: null }));

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });

      await recording.startAsync();
      recordingRef.current = recording;

      audioLevelInterval.current = setInterval(async () => {
        if (!recordingRef.current) return;
        
        try {
          const status = await recordingRef.current.getStatusAsync();
          if (status.isRecording && status.metering !== undefined) {
            const normalized = Math.max(0, Math.min(1, (status.metering + 60) / 60));
            setState(prev => ({ ...prev, audioLevel: normalized }));
          }
        } catch (error) {
          console.error('Audio level monitoring error:', error);
        }
      }, 100);

    } catch (error) {
      console.error('Recording error:', error);
      setState(prev => ({
        ...prev,
        isRecording: false,
        error: 'Failed to start recording. Please try again.',
      }));
    }
  }, []);

  const stopRecording = useCallback(async () => {
    let isCurrentlyRecording = false;
    setState(prev => {
      isCurrentlyRecording = prev.isRecording;
      return prev;
    });
    
    if (!isCurrentlyRecording || !recordingRef.current) {
      return;
    }

    try {
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current);
        audioLevelInterval.current = null;
      }

      const recordingToStop = recordingRef.current;
      recordingRef.current = null;
      
      await recordingToStop.stopAndUnloadAsync();
      const uri = recordingToStop.getURI();

      setState(prev => ({ 
        ...prev, 
        isRecording: false, 
        isProcessing: true,
        audioLevel: 0,
      }));

      if (!uri) {
        throw new Error('No recording URI');
      }

      const validation = await aiVoiceService.validateAudioQuality(uri);
      if (!validation.isValid) {
        setState(prev => ({
          ...prev,
          isProcessing: false,
          error: validation.issues[0] || 'Audio quality issue',
        }));
        return;
      }

      const transcription = await aiVoiceService.speechToText({ audioUri: uri });
      
      if (!transcription.text || transcription.text.trim().length < 2) {
        setState(prev => ({
          ...prev,
          isProcessing: false,
          error: 'Could not detect speech. Please try again.',
        }));
        
        setTimeout(() => {
          setState(prev => ({ ...prev, error: null }));
          if (state.isActive && !state.isRecording) {
            startRecording();
          }
        }, 1500);
        return;
      }

      await sendMessage(transcription.text);

    } catch (error: any) {
      console.error('Stop recording error:', error);
      setState(prev => ({
        ...prev,
        isRecording: false,
        isProcessing: false,
        error: error.message || 'Failed to process recording.',
      }));
    }
  }, [state.isActive, state.isRecording]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) {
      return;
    }

    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      setState(prev => ({ ...prev, isProcessing: true, error: null }));

      const userMessage: CoachMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory, userMessage],
        currentMessage: message,
      }));

      // Get Supabase URL and key
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
      }

      // Call coach-ai edge function
      console.log('🤖 Calling coach AI API...');
      const response = await fetch(`${supabaseUrl}/functions/v1/coach-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          message,
          mode: state.mode,
          conversationHistory: state.conversationHistory.slice(-6),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Coaching service failed');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Coaching service failed');
      }

      const coachResponse = result.data.response;
      console.log('💡 Got coach response');

      const coachMessage: CoachMessage = {
        role: 'coach',
        content: coachResponse,
        timestamp: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        conversationHistory: [...prev.conversationHistory, coachMessage],
        isProcessing: false,
      }));

      await playAIResponse(coachResponse);

    } catch (error: any) {
      console.error('Send message error:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error.message || 'Failed to get response from coach.',
      }));
    }
  }, [state.mode, state.conversationHistory]);

  const playAIResponse = async (text: string) => {
    try {
      setState(prev => ({ ...prev, isPlaying: true }));

      const audioUri = await aiVoiceService.textToSpeech({ 
        text, 
        voice: 'rachel',
        speed: 1.0 
      });

      if (!audioUri) {
        throw new Error('No audio URI returned');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: !state.isSpeakerMode,
        interruptionModeIOS: 2,
        interruptionModeAndroid: 1,
      });

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { 
          shouldPlay: true, 
          isLooping: false,
          volume: 1.0,
        }
      );

      soundRef.current = sound;

      await new Promise<void>((resolve, reject) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            resolve();
          } else if (!status.isLoaded && status.error) {
            reject(new Error('Playback failed'));
          }
        });
      });

      await sound.unloadAsync();
      soundRef.current = null;

    } catch (error) {
      console.error('Play AI response error:', error);
      
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        } catch (e) {}
        soundRef.current = null;
      }
      
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to play audio response.',
      }));
    } finally {
      setState(prev => ({ ...prev, isPlaying: false }));
      
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: !state.isSpeakerMode,
          interruptionModeIOS: 2,
          interruptionModeAndroid: 1,
        });
      } catch (e) {}
      
      if (autoRecordTimeoutRef.current) {
        clearTimeout(autoRecordTimeoutRef.current);
        autoRecordTimeoutRef.current = null;
      }
      
      setState(prev => {
        if (prev.isActive && !prev.isRecording && !prev.isProcessing) {
          autoRecordTimeoutRef.current = setTimeout(() => {
            startRecording().catch(err => {
              console.error('Auto-record failed:', err);
            });
          }, 800);
        }
        return prev;
      });
    }
  };

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const toggleSpeakerMode = useCallback(async () => {
    try {
      const newSpeakerMode = !state.isSpeakerMode;
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: !newSpeakerMode,
        interruptionModeIOS: 2,
        interruptionModeAndroid: 1,
      });

      setState(prev => ({ ...prev, isSpeakerMode: newSpeakerMode }));
      
      console.log(`🔊 Audio output: ${newSpeakerMode ? 'Speaker' : 'Earpiece'}`);
    } catch (error) {
      console.error('Toggle speaker mode error:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to change audio output',
      }));
    }
  }, [state.isSpeakerMode]);

  return [
    state,
    {
      startSession,
      endSession,
      startRecording,
      stopRecording,
      sendMessage,
      toggleSpeakerMode,
      clearError,
    },
  ];
};

