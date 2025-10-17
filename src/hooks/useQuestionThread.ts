// Hook for fetching and managing a single question thread
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getQuestionThread,
  createQuestionResponse,
  updateThreadRecipient,
} from '@/lib/database/supabase';
import { useAuth } from '@/lib/auth/AuthContext';

export const useQuestionThread = (threadId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: thread,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['question-thread', threadId],
    queryFn: async () => {
      return await getQuestionThread(threadId);
    },
    enabled: !!threadId,
  });

  // Mutation to update recipient (when they first view the thread)
  const updateRecipientMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      await updateThreadRecipient(threadId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-thread', threadId] });
      queryClient.invalidateQueries({ queryKey: ['shared-questions'] });
    },
  });

  // Mutation to submit response
  const submitResponseMutation = useMutation({
    mutationFn: async (responseText: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return await createQuestionResponse(threadId, user.id, responseText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-thread', threadId] });
      queryClient.invalidateQueries({ queryKey: ['shared-questions'] });
    },
  });

  return {
    thread,
    isLoading,
    error,
    refetch,
    updateRecipient: updateRecipientMutation.mutate,
    submitResponse: submitResponseMutation.mutate,
    isSubmitting: submitResponseMutation.isPending,
  };
};

