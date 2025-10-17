// Hook for fetching user's shared question threads
import { useQuery } from '@tanstack/react-query';
import { getUserThreads } from '@/lib/database/supabase';
import { useAuth } from '@/lib/auth/AuthContext';

export const useSharedQuestions = () => {
  const { user } = useAuth();

  const {
    data: threads,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['shared-questions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await getUserThreads(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60, // 1 minute
  });

  return {
    threads: threads || [],
    isLoading,
    error,
    refetch,
  };
};

