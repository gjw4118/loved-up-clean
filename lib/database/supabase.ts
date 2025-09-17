// Supabase Client Configuration
// Based on PRD requirements for Connect app

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Environment variables (you'll need to add these to your .env)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with custom configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic token refresh
    autoRefreshToken: true,
    // Persist session in storage
    persistSession: true,
    // Detect session from URL (for OAuth flows)
    detectSessionInUrl: true,
    // Storage configuration will be set up with MMKV
    storage: undefined, // Will be configured in auth setup
  },
  realtime: {
    // Enable realtime for sharing features
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'connect-question-cards-app',
    },
  },
});

// Database type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Specific table types for easier usage
export type QuestionDeck = Tables<'question_decks'>;
export type Question = Tables<'questions'>;
export type UserProfile = Tables<'user_profiles'>;
export type UserInteraction = Tables<'user_interactions'>;
export type QuestionSession = Tables<'question_sessions'>;
export type SharedQuestion = Tables<'shared_questions'>;
export type UserProgress = Tables<'user_progress'>;

// Insert types
export type QuestionDeckInsert = Database['public']['Tables']['question_decks']['Insert'];
export type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
export type UserInteractionInsert = Database['public']['Tables']['user_interactions']['Insert'];
export type QuestionSessionInsert = Database['public']['Tables']['question_sessions']['Insert'];
export type SharedQuestionInsert = Database['public']['Tables']['shared_questions']['Insert'];
export type UserProgressInsert = Database['public']['Tables']['user_progress']['Insert'];

// Update types
export type QuestionDeckUpdate = Database['public']['Tables']['question_decks']['Update'];
export type QuestionUpdate = Database['public']['Tables']['questions']['Update'];
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];
export type UserInteractionUpdate = Database['public']['Tables']['user_interactions']['Update'];
export type QuestionSessionUpdate = Database['public']['Tables']['question_sessions']['Update'];
export type UserProgressUpdate = Database['public']['Tables']['user_progress']['Update'];

// Helper functions for common queries
export const getQuestionDecks = async () => {
  const { data, error } = await supabase
    .from('question_decks')
    .select('*')
    .eq('is_active', true)
    .order('popularity_score', { ascending: false });

  if (error) throw error;
  return data;
};

export const getQuestionsByDeck = async (deckId: string, limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('deck_id', deckId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const createUserInteraction = async (interaction: UserInteractionInsert) => {
  const { data, error } = await supabase
    .from('user_interactions')
    .insert(interaction)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserProgress = async (userId: string, deckId?: string) => {
  let query = supabase
    .from('user_progress')
    .select(`
      *,
      question_decks (
        name,
        category,
        icon
      )
    `)
    .eq('user_id', userId);

  if (deckId) {
    query = query.eq('deck_id', deckId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// Real-time subscriptions for sharing features
export const subscribeToSharedQuestions = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('shared_questions')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'shared_questions',
        filter: `shared_by=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

// Analytics helpers
export const trackQuestionView = async (questionId: string) => {
  const { error } = await supabase.rpc('increment_question_views', {
    question_id: questionId,
  });

  if (error) console.error('Error tracking question view:', error);
};

export const trackQuestionShare = async (questionId: string, shareMethod: string) => {
  const { error } = await supabase.rpc('increment_question_shares', {
    question_id: questionId,
    share_method: shareMethod,
  });

  if (error) console.error('Error tracking question share:', error);
};
