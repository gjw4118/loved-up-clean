import type {
    AudioValidationResult,
    STTOptions,
    TTSOptions,
    VoiceModel,
    VoiceProvider
} from '@/types/coach';
import * as FileSystem from 'expo-file-system';

/**
 * AI Voice Service for GoDeeper
 * Handles speech-to-text and text-to-speech operations
 */

class AIVoiceService {
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    this.supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.warn('⚠️ Voice Service: Supabase credentials not configured');
    }
  }

  /**
   * Detect which provider to use based on voice model
   */
  private getVoiceProvider(voice: VoiceModel): VoiceProvider {
    const ELEVENLABS_VOICES_MAP: Record<string, boolean> = {
      'rachel': true,
      'domi': true,
      'bella': true,
      'antoni': true,
      'elli': true,
      'josh': true,
      'arnold': true,
      'adam': true,
      'sam': true,
      'nicole': true,
      'glinda': true,
      'mimi': true,
    };
    
    if (ELEVENLABS_VOICES_MAP[voice]) {
      return 'elevenlabs';
    }
    return 'openai';
  }

  /**
   * Get voice ID for the provider
   */
  private getVoiceId(voice: VoiceModel): string {
    const VOICE_IDS: Record<string, string> = {
      // OpenAI voices
      'alloy': 'alloy',
      'echo': 'echo',
      'fable': 'fable',
      'onyx': 'onyx',
      'nova': 'nova',
      'shimmer': 'shimmer',
      // ElevenLabs voices
      'rachel': 'Rachel',
      'domi': 'Domi',
      'bella': 'Bella',
      'antoni': 'Antoni',
      'elli': 'Elli',
      'josh': 'Josh',
      'arnold': 'Arnold',
      'adam': 'Adam',
      'sam': 'Sam',
      'nicole': 'Nicole',
      'glinda': 'Glinda',
      'mimi': 'Mimi',
    };
    
    return VOICE_IDS[voice] || voice;
  }

  /**
   * Convert text to speech with high quality voice
   * Automatically selects provider (OpenAI or ElevenLabs) based on voice
   */
  async textToSpeech({
    text,
    voice = 'rachel',
    model = 'hd',
    speed = 1.0,
  }: TTSOptions): Promise<string> {
    try {
      if (!this.supabaseUrl || !this.supabaseKey) {
        throw new Error('Supabase not configured for voice service');
      }

      const provider = this.getVoiceProvider(voice);
      const voiceId = this.getVoiceId(voice);
      
      const TTS_QUALITY_MAP: Record<string, string> = {
        'hd': 'tts-1-hd',
        'standard': 'tts-1',
      };

      console.log('🎙️ TTS Request:', {
        provider,
        voice: voiceId,
        textLength: text.length,
      });

      const response = await fetch(`${this.supabaseUrl}/functions/v1/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.supabaseKey}`,
        },
        body: JSON.stringify({
          text,
          voice: voiceId,
          provider,
          model: provider === 'openai' ? TTS_QUALITY_MAP[model] : undefined,
          speed: Math.max(0.25, Math.min(4.0, speed)),
          response_format: 'mp3',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `TTS failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle both direct response and nested data structure
      const audioUri = data.data?.audioUri || data.audioUri;
      
      if (!audioUri) {
        console.error('❌ No audioUri in TTS response:', data);
        throw new Error('No audio URI returned from text-to-speech service');
      }
      
      console.log('✅ TTS Success: Audio URI received');
      return audioUri;
    } catch (error) {
      console.error('❌ TTS error:', error);
      throw error;
    }
  }

  /**
   * Convert speech to text using Whisper
   */
  async speechToText({
    audioUri,
    language = 'en',
    model = 'whisper-1',
  }: STTOptions): Promise<{ text: string; confidence: number }> {
    try {
      if (!this.supabaseUrl || !this.supabaseKey) {
        throw new Error('Supabase not configured for voice service');
      }

      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      if (!fileInfo.exists) {
        throw new Error('Audio file not found');
      }

      console.log('🎤 STT Request:', {
        audioUri: audioUri.substring(0, 50) + '...',
        fileSize: (fileInfo as any).size,
      });

      // Create form data
      const formData = new FormData();
      const fileName = audioUri.split('/').pop() || 'recording.m4a';
      const mimeType = this.getMimeType(fileName);

      const file: any = {
        uri: audioUri,
        name: fileName,
        type: mimeType,
      };

      formData.append('audio', file);
      formData.append('language', language);
      formData.append('model', model);

      const response = await fetch(`${this.supabaseUrl}/functions/v1/speech-to-text`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`STT failed: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ STT Success:', data.text?.substring(0, 100) + '...');
      
      return {
        text: data.text || '',
        confidence: data.confidence || 1.0,
      };
    } catch (error) {
      console.error('❌ STT error:', error);
      throw error;
    }
  }

  /**
   * Validate audio quality before processing
   */
  async validateAudioQuality(audioUri: string): Promise<AudioValidationResult> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      
      if (!fileInfo.exists) {
        return {
          isValid: false,
          issues: ['Audio file does not exist'],
        };
      }

      const fileSize = (fileInfo as any).size || 0;
      
      // Check minimum file size (at least 1KB)
      if (fileSize < 1000) {
        return {
          isValid: false,
          issues: ['Audio file is too small - may be empty or corrupted'],
        };
      }

      // Check maximum file size (25MB limit for most APIs)
      if (fileSize > 25 * 1024 * 1024) {
        return {
          isValid: false,
          issues: ['Audio file is too large (max 25MB)'],
        };
      }

      return {
        isValid: true,
        issues: [],
      };
    } catch (error) {
      console.error('Audio validation error:', error);
      return {
        isValid: false,
        issues: ['Failed to validate audio file'],
      };
    }
  }

  /**
   * Get MIME type from filename
   */
  private getMimeType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'm4a': 'audio/m4a',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'webm': 'audio/webm',
      'ogg': 'audio/ogg',
    };
    return mimeTypes[extension || ''] || 'audio/m4a';
  }
}

// Export singleton instance
export const aiVoiceService = new AIVoiceService();

