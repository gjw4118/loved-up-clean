// Question Cards App - Type Definitions
// Based on PRD requirements

export interface QuestionDeck {
  id: string;
  name: string;
  description: string;
  category: DeckCategory;
  icon: string;
  question_count: number;
  popularity_score: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  deck_id: string;
  text: string;
  difficulty_level: DifficultyLevel;
  tags: string[];
  completion_rate: number;
  skip_rate: number;
  created_at: string;
  updated_at: string;
}

export interface UserInteraction {
  id: string;
  user_id: string;
  question_id: string;
  interaction_type: InteractionType;
  timestamp: string;
  session_id: string;
}

export interface QuestionSession {
  id: string;
  user_id: string;
  deck_id: string;
  started_at: string;
  ended_at?: string;
  questions_completed: number;
  questions_skipped: number;
}

export interface SharedQuestion {
  id: string;
  question_id: string;
  shared_by: string;
  shared_via: ShareMethod;
  shared_at: string;
  recipient_info?: string;
}

// Enums
export enum DeckCategory {
  FRIENDS = 'friends',
  FAMILY = 'family',
  DATING = 'dating',
  GROWING = 'growing',
  SPICE = 'spice'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum InteractionType {
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  FAVORITED = 'favorited'
}

export enum ShareMethod {
  IMESSAGE = 'imessage',
  IN_APP = 'in_app',
  LINK = 'link'
}

// UI State Types
export interface QuestionCardState {
  currentQuestion: Question | null;
  isLoading: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface DeckBrowseState {
  selectedDeck: QuestionDeck | null;
  questions: Question[];
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
}

// Analytics Types
export interface QuestionAnalytics {
  question_id: string;
  views: number;
  completions: number;
  skips: number;
  shares: number;
  average_session_time: number;
}

export interface DeckAnalytics {
  deck_id: string;
  total_questions: number;
  completion_rate: number;
  average_session_duration: number;
  most_popular_questions: string[];
  user_retention_rate: number;
}
