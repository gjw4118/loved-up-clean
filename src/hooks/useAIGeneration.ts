// AI Question Generation Hook
// Provides AI-powered question generation using OpenAI

import { InteractionType } from '@/types/questions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface GenerateQuestionsRequest {
  category: 'friends' | 'family' | 'romantic' | 'professional';
  count?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  userPreferences?: {
    previousQuestions?: string[];
    skippedQuestions?: string[];
    completedQuestions?: string[];
  };
}

interface GeneratedQuestion {
  text: string;
  depth_level: 'standard' | 'deeper';
  tags: string[];
}

interface GenerateQuestionsResponse {
  questions: GeneratedQuestion[];
  category: string;
  count: number;
}

// Hook for generating AI questions
export function useGenerateQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: GenerateQuestionsRequest): Promise<GeneratedQuestion[]> => {
      // Use the deployed Vercel API endpoint
      const apiUrl = 'https://loved-up-clean-p17dae53f-greg-woulfes-projects.vercel.app/api/generate-questions';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate questions');
      }

      const data: GenerateQuestionsResponse = await response.json();
      return data.questions;
    },
    onSuccess: (questions, variables) => {
      // Invalidate questions cache for the category
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.category],
      });
    },
  });
}

// Hook for generating adaptive questions based on user behavior
export function useGenerateAdaptiveQuestions() {
  const generateQuestions = useGenerateQuestions();

  const generateAdaptiveQuestions = async (
    category: 'friends' | 'family' | 'romantic' | 'professional',
    userInteractions: Array<{
      questionId: string;
      questionText: string;
      interactionType: InteractionType;
    }>,
    count: number = 5
  ) => {
    // Analyze user interactions to create preferences
    const completedQuestions = userInteractions
      .filter(i => i.interactionType === 'completed')
      .map(i => i.questionText);

    const skippedQuestions = userInteractions
      .filter(i => i.interactionType === 'skipped')
      .map(i => i.questionText);

    const previousQuestions = userInteractions
      .map(i => i.questionText)
      .slice(-10); // Last 10 questions

    // Determine difficulty based on completion rate
    const completionRate = completedQuestions.length / userInteractions.length;
    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
    
    if (completionRate > 0.8) {
      difficulty = 'hard'; // User completes most questions, try harder ones
    } else if (completionRate < 0.4) {
      difficulty = 'easy'; // User skips many questions, try easier ones
    }

    return generateQuestions.mutateAsync({
      category,
      count,
      difficulty,
      userPreferences: {
        previousQuestions,
        skippedQuestions,
        completedQuestions,
      },
    });
  };

  return {
    ...generateQuestions,
    generateAdaptiveQuestions,
  };
}

// Utility function to save generated questions to Supabase
export async function saveGeneratedQuestions(
  questions: GeneratedQuestion[],
  deckId: string,
  supabase: any
) {
  const questionsToInsert = questions.map(q => ({
    deck_id: deckId,
    text: q.text,
    depth_level: q.depth_level,
    tags: q.tags,
    is_active: true,
  }));

  const { data, error } = await supabase
    .from('questions')
    .insert(questionsToInsert)
    .select();

  if (error) {
    throw new Error(`Failed to save questions: ${error.message}`);
  }

  return data;
}
