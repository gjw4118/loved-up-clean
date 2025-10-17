// Supabase Client Configuration
// Based on PRD requirements for Connect app

import { Database } from '@/types/database';
import { createClient } from '@supabase/supabase-js';

// Environment variables (you'll need to add these to your .env)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client with custom configuration (or mock if env vars missing)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Enable automatic token refresh
        autoRefreshToken: true,
        // Persist session in storage
        persistSession: true,
        // Detect session from URL (for OAuth flows)
        detectSessionInUrl: true,
        // Storage configuration will be set up with AsyncStorage
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
    })
  : ((() => {
      console.warn('⚠️  Supabase not configured - create .env.local with EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
      return null as any; // Mock client for development
    })());

// Log Supabase configuration status
console.log('🔧 Supabase Configuration:', {
  url: supabaseUrl ? '✅ Configured' : '❌ Missing',
  anonKey: supabaseAnonKey ? '✅ Configured' : '❌ Missing',
  client: supabase ? '✅ Created' : '❌ Failed',
  bypassAuth: process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true' ? '🔧 Enabled' : '❌ Disabled',
});

// If Supabase is not configured and bypass auth is disabled, warn user
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.EXPO_PUBLIC_BYPASS_AUTH !== 'true') {
    console.warn('⚠️ Supabase credentials missing! Set EXPO_PUBLIC_BYPASS_AUTH=true in .env.local to bypass auth, or configure Supabase credentials.');
  }
}

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
export type QuestionThread = Tables<'question_threads'>;
export type QuestionResponse = Tables<'question_responses'>;

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

// Question sharing helpers
export const createQuestionThread = async (
  questionId: string,
  senderId: string
): Promise<string> => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('question_threads')
    .insert({
      question_id: questionId,
      sender_id: senderId,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

export const getQuestionThread = async (threadId: string) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('question_threads')
    .select(`
      *,
      questions (
        id,
        text,
        deck_id,
        question_decks (
          name,
          category
        )
      ),
      sender:user_profiles!sender_id (
        id,
        display_name,
        avatar_url
      ),
      recipient:user_profiles!recipient_id (
        id,
        display_name,
        avatar_url
      ),
      question_responses (
        id,
        response_text,
        created_at,
        responder:user_profiles (
          id,
          display_name,
          avatar_url
        )
      )
    `)
    .eq('id', threadId)
    .single();

  if (error) throw error;
  return data;
};

export const getUserThreads = async (userId: string) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { data, error } = await supabase
    .from('question_threads')
    .select(`
      *,
      questions (
        id,
        text,
        question_decks (
          name,
          category
        )
      ),
      sender:user_profiles!sender_id (
        id,
        display_name,
        avatar_url
      ),
      recipient:user_profiles!recipient_id (
        id,
        display_name,
        avatar_url
      ),
      question_responses (
        id,
        response_text,
        created_at
      )
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateThreadRecipient = async (
  threadId: string,
  recipientId: string
) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  const { error } = await supabase
    .from('question_threads')
    .update({ recipient_id: recipientId })
    .eq('id', threadId);

  if (error) throw error;
};

export const createQuestionResponse = async (
  threadId: string,
  responderId: string,
  responseText: string
) => {
  if (!supabase) throw new Error('Supabase not configured');
  
  // Create response
  const { data: response, error: responseError } = await supabase
    .from('question_responses')
    .insert({
      thread_id: threadId,
      responder_id: responderId,
      response_text: responseText,
    })
    .select()
    .single();

  if (responseError) throw responseError;

  // Update thread status
  const { error: threadError } = await supabase
    .from('question_threads')
    .update({ status: 'answered' })
    .eq('id', threadId);

  if (threadError) throw threadError;

  return response;
};
