// User Profile and Authentication Types
// Based on PRD requirements

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  
  // Preferences
  preferred_decks: string[];
  notification_settings: NotificationSettings;
  privacy_settings: PrivacySettings;
  
  // Progress tracking
  total_questions_completed: number;
  total_questions_skipped: number;
  favorite_questions: string[];
  current_streak: number;
  longest_streak: number;
  
  // Onboarding
  onboarding_completed: boolean;
  onboarding_step: number;
}

export interface NotificationSettings {
  daily_reminder: boolean;
  weekly_summary: boolean;
  new_questions: boolean;
  sharing_notifications: boolean;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  allow_question_sharing: boolean;
  analytics_opt_in: boolean;
}

export interface UserProgress {
  user_id: string;
  deck_id: string;
  questions_completed: number;
  questions_skipped: number;
  last_question_id?: string;
  progress_percentage: number;
  updated_at: string;
}

export interface UserStats {
  total_sessions: number;
  total_time_spent: number; // in minutes
  average_session_duration: number;
  questions_per_session: number;
  favorite_deck: string;
  completion_rate: number;
  sharing_frequency: number;
}

// Authentication Types
export interface AuthUser {
  id: string;
  email: string;
  provider: AuthProvider;
  created_at: string;
  last_sign_in: string;
}

export enum AuthProvider {
  APPLE = 'apple',
  GOOGLE = 'google',
  EMAIL = 'email'
}

// Onboarding Types
export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: string;
  required: boolean;
}

export interface OnboardingProgress {
  user_id: string;
  current_step: number;
  completed_steps: number[];
  started_at: string;
  completed_at?: string;
}
