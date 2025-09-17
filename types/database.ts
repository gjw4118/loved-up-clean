// Auto-generated Supabase types
// This file should be generated using: npx supabase gen types typescript --project-id YOUR_PROJECT_ID

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      question_decks: {
        Row: {
          id: string
          name: string
          description: string | null
          category: 'friends' | 'family' | 'romantic' | 'professional'
          icon: string | null
          question_count: number
          popularity_score: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: 'friends' | 'family' | 'romantic' | 'professional'
          icon?: string | null
          question_count?: number
          popularity_score?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: 'friends' | 'family' | 'romantic' | 'professional'
          icon?: string | null
          question_count?: number
          popularity_score?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          deck_id: string
          text: string
          difficulty_level: 'easy' | 'medium' | 'hard'
          tags: string[]
          completion_rate: number
          skip_rate: number
          view_count: number
          share_count: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          text: string
          difficulty_level?: 'easy' | 'medium' | 'hard'
          tags?: string[]
          completion_rate?: number
          skip_rate?: number
          view_count?: number
          share_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deck_id?: string
          text?: string
          difficulty_level?: 'easy' | 'medium' | 'hard'
          tags?: string[]
          completion_rate?: number
          skip_rate?: number
          view_count?: number
          share_count?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          preferred_decks: string[]
          notification_settings: Json
          privacy_settings: Json
          total_questions_completed: number
          total_questions_skipped: number
          favorite_questions: string[]
          current_streak: number
          longest_streak: number
          onboarding_completed: boolean
          onboarding_step: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          preferred_decks?: string[]
          notification_settings?: Json
          privacy_settings?: Json
          total_questions_completed?: number
          total_questions_skipped?: number
          favorite_questions?: string[]
          current_streak?: number
          longest_streak?: number
          onboarding_completed?: boolean
          onboarding_step?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          avatar_url?: string | null
          preferred_decks?: string[]
          notification_settings?: Json
          privacy_settings?: Json
          total_questions_completed?: number
          total_questions_skipped?: number
          favorite_questions?: string[]
          current_streak?: number
          longest_streak?: number
          onboarding_completed?: boolean
          onboarding_step?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_interactions: {
        Row: {
          id: string
          user_id: string
          question_id: string
          interaction_type: 'completed' | 'skipped' | 'favorited'
          session_id: string | null
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          interaction_type: 'completed' | 'skipped' | 'favorited'
          session_id?: string | null
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          interaction_type?: 'completed' | 'skipped' | 'favorited'
          session_id?: string | null
          timestamp?: string
        }
      }
      question_sessions: {
        Row: {
          id: string
          user_id: string
          deck_id: string
          started_at: string
          ended_at: string | null
          questions_completed: number
          questions_skipped: number
          session_duration_minutes: number | null
        }
        Insert: {
          id?: string
          user_id: string
          deck_id: string
          started_at?: string
          ended_at?: string | null
          questions_completed?: number
          questions_skipped?: number
        }
        Update: {
          id?: string
          user_id?: string
          deck_id?: string
          started_at?: string
          ended_at?: string | null
          questions_completed?: number
          questions_skipped?: number
        }
      }
      shared_questions: {
        Row: {
          id: string
          question_id: string
          shared_by: string
          shared_via: 'imessage' | 'in_app' | 'link'
          recipient_info: string | null
          shared_at: string
        }
        Insert: {
          id?: string
          question_id: string
          shared_by: string
          shared_via: 'imessage' | 'in_app' | 'link'
          recipient_info?: string | null
          shared_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          shared_by?: string
          shared_via?: 'imessage' | 'in_app' | 'link'
          recipient_info?: string | null
          shared_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          deck_id: string
          questions_completed: number
          questions_skipped: number
          last_question_id: string | null
          progress_percentage: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          deck_id: string
          questions_completed?: number
          questions_skipped?: number
          last_question_id?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          deck_id?: string
          questions_completed?: number
          questions_skipped?: number
          last_question_id?: string | null
          updated_at?: string
        }
      }
      question_analytics: {
        Row: {
          id: string
          question_id: string
          date: string
          views: number
          completions: number
          skips: number
          shares: number
          average_session_time_seconds: number
        }
        Insert: {
          id?: string
          question_id: string
          date?: string
          views?: number
          completions?: number
          skips?: number
          shares?: number
          average_session_time_seconds?: number
        }
        Update: {
          id?: string
          question_id?: string
          date?: string
          views?: number
          completions?: number
          skips?: number
          shares?: number
          average_session_time_seconds?: number
        }
      }
      deck_analytics: {
        Row: {
          id: string
          deck_id: string
          date: string
          total_sessions: number
          total_questions_completed: number
          total_questions_skipped: number
          average_session_duration_minutes: number
          unique_users: number
        }
        Insert: {
          id?: string
          deck_id: string
          date?: string
          total_sessions?: number
          total_questions_completed?: number
          total_questions_skipped?: number
          average_session_duration_minutes?: number
          unique_users?: number
        }
        Update: {
          id?: string
          deck_id?: string
          date?: string
          total_sessions?: number
          total_questions_completed?: number
          total_questions_skipped?: number
          average_session_duration_minutes?: number
          unique_users?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_question_views: {
        Args: {
          question_id: string
        }
        Returns: undefined
      }
      increment_question_shares: {
        Args: {
          question_id: string
          share_method: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
