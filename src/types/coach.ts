// Relationship Coach Types

export type CoachMode = 'conversation' | 'guidance';

export interface CoachMessage {
  role: 'user' | 'coach';
  content: string;
  timestamp: string;
  audioUri?: string;
}

export interface CoachSession {
  id: string;
  user_id: string;
  mode: CoachMode;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
  transcript?: CoachMessage[];
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface CoachTopic {
  id: string;
  session_id: string;
  topic: string;
  created_at: string;
}

export interface CoachVoiceState {
  isActive: boolean;
  mode: CoachMode;
  isRecording: boolean;
  isPlaying: boolean;
  isProcessing: boolean;
  isSpeakerMode: boolean;
  conversationHistory: CoachMessage[];
  currentMessage: string;
  audioLevel: number;
  error: string | null;
  hasPermissions: boolean;
  sessionId: string | null;
}

export interface CoachVoiceActions {
  startSession: (mode: CoachMode) => Promise<void>;
  endSession: () => Promise<void>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  toggleSpeakerMode: () => Promise<void>;
  clearError: () => void;
}

// Voice service types
export type VoiceProvider = 'openai' | 'elevenlabs';

export const OPENAI_VOICES = {
  alloy: 'alloy',
  echo: 'echo',
  fable: 'fable',
  onyx: 'onyx',
  nova: 'nova',
  shimmer: 'shimmer',
} as const;

export const ELEVENLABS_VOICES = {
  rachel: 'Rachel',
  domi: 'Domi',
  bella: 'Bella',
  antoni: 'Antoni',
  elli: 'Elli',
  josh: 'Josh',
  arnold: 'Arnold',
  adam: 'Adam',
  sam: 'Sam',
  nicole: 'Nicole',
  glinda: 'Glinda',
  mimi: 'Mimi',
} as const;

export const VOICE_MODELS = {
  ...OPENAI_VOICES,
  ...ELEVENLABS_VOICES,
} as const;

export type VoiceModel = keyof typeof VOICE_MODELS;

export const TTS_QUALITY = {
  hd: 'tts-1-hd',
  standard: 'tts-1',
} as const;

export interface TTSOptions {
  text: string;
  voice?: VoiceModel;
  model?: keyof typeof TTS_QUALITY;
  speed?: number;
}

export interface STTOptions {
  audioUri: string;
  language?: string;
  model?: 'whisper-1';
}

export interface AudioValidationResult {
  isValid: boolean;
  issues: string[];
}

