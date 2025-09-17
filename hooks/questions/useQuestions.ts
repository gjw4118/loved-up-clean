// Question Management Hooks
// Provides data fetching and state management for questions

import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/database/supabase';
import { InteractionType, Question, QuestionDeck, UserInteraction } from '@/types/questions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Query keys for React Query
export const QUESTION_QUERY_KEYS = {
  decks: ['question-decks'] as const,
  questions: (deckId?: string) => ['questions', deckId] as const,
  userInteractions: (userId: string) => ['user-interactions', userId] as const,
  userProgress: (userId: string, deckId?: string) => ['user-progress', userId, deckId] as const,
};

// Fetch all active question decks
export function useQuestionDecks() {
  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.decks,
    queryFn: async (): Promise<QuestionDeck[]> => {
      const { data, error } = await supabase
        .from('question_decks')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching question decks:', error);
        throw new Error('Failed to fetch question decks');
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Fetch questions for a specific deck
export function useQuestions(deckId: string, options?: {
  limit?: number;
  excludeInteracted?: boolean;
}) {
  const { user } = useAuth();
  const { limit = 50, excludeInteracted = false } = options || {};

  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.questions(deckId),
    queryFn: async (): Promise<Question[]> => {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('deck_id', deckId)
        .eq('is_active', true)
        .order('created_at')
        .limit(limit);

      // If user wants to exclude already interacted questions
      if (excludeInteracted && user) {
        const { data: interactions } = await supabase
          .from('user_interactions')
          .select('question_id')
          .eq('user_id', user.id);

        if (interactions && interactions.length > 0) {
          const interactedQuestionIds = interactions.map(i => i.question_id);
          query = query.not('id', 'in', `(${interactedQuestionIds.join(',')})`);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching questions:', error);
        throw new Error('Failed to fetch questions');
      }

      return data || [];
    },
    enabled: !!deckId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch user interactions for questions
export function useUserInteractions(questionIds?: string[]) {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.userInteractions(user?.id || ''),
    queryFn: async (): Promise<UserInteraction[]> => {
      if (!user) return [];

      let query = supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', user.id);

      if (questionIds && questionIds.length > 0) {
        query = query.in('question_id', questionIds);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching user interactions:', error);
        throw new Error('Failed to fetch user interactions');
      }

      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Record user interaction with a question
export function useRecordInteraction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionId,
      interactionType,
      sessionId,
    }: {
      questionId: string;
      interactionType: InteractionType;
      sessionId?: string;
    }) => {
      if (!user) {
        throw new Error('User must be authenticated to record interactions');
      }

      const { data, error } = await supabase
        .from('user_interactions')
        .upsert({
          user_id: user.id,
          question_id: questionId,
          interaction_type: interactionType,
          session_id: sessionId,
          timestamp: new Date().toISOString(),
        }, {
          onConflict: 'user_id,question_id,interaction_type'
        });

      if (error) {
        console.error('Error recording interaction:', error);
        throw new Error('Failed to record interaction');
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({
        queryKey: QUESTION_QUERY_KEYS.userInteractions(user?.id || '')
      });
      queryClient.invalidateQueries({
        queryKey: QUESTION_QUERY_KEYS.userProgress(user?.id || '')
      });
    },
  });
}

// Get user progress for a deck
export function useUserProgress(deckId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.userProgress(user?.id || '', deckId),
    queryFn: async () => {
      if (!user) return null;

      let query = supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (deckId) {
        query = query.eq('deck_id', deckId).single();
      }

      const { data, error } = await query;

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user progress:', error);
        throw new Error('Failed to fetch user progress');
      }

      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get random question from deck (excluding already interacted)
export function useRandomQuestion(deckId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['random-question', deckId, user?.id],
    queryFn: async (): Promise<Question | null> => {
      // First get all questions from the deck
      let questionsQuery = supabase
        .from('questions')
        .select('*')
        .eq('deck_id', deckId)
        .eq('is_active', true);

      // If user is authenticated, exclude already interacted questions
      if (user) {
        const { data: interactions } = await supabase
          .from('user_interactions')
          .select('question_id')
          .eq('user_id', user.id);

        if (interactions && interactions.length > 0) {
          const interactedQuestionIds = interactions.map(i => i.question_id);
          questionsQuery = questionsQuery.not('id', 'in', `(${interactedQuestionIds.join(',')})`);
        }
      }

      const { data: questions, error } = await questionsQuery;

      if (error) {
        console.error('Error fetching random question:', error);
        throw new Error('Failed to fetch random question');
      }

      if (!questions || questions.length === 0) {
        return null; // No more questions available
      }

      // Return random question
      const randomIndex = Math.floor(Math.random() * questions.length);
      return questions[randomIndex];
    },
    enabled: !!deckId,
    staleTime: 0, // Always fetch fresh for randomness
  });
}
