import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAdminService } from '../service/adminRuntime';
import { queryKeys } from './queryKeys';
import { validateRequired } from '../../utils';

export function useVoteListController() {
  const adminService = useAdminService();
  const queryClient = useQueryClient();

  const votesQuery = useQuery({
    queryKey: queryKeys.votes,
    queryFn: () => adminService.fetchVotes(),
  });

  const questionCountQueries = useQueries({
    queries: (votesQuery.data ?? []).map((vote) => ({
      queryKey: queryKeys.questions(vote.id),
      queryFn: () => adminService.fetchQuestions(vote.id),
      enabled: votesQuery.isSuccess,
    })),
  });

  const createVoteMutation = useMutation({
    mutationFn: (input: { name: string }) => adminService.createVote(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.votes });
    },
  });

  const questionCounts = new Map<string, number>();
  (votesQuery.data ?? []).forEach((vote, index) => {
    questionCounts.set(vote.id, questionCountQueries[index]?.data?.length ?? 0);
  });

  const createVote = async (name: string) => {
    const result = validateRequired(name, 'vote 이름');
    if (!result.isValid) {
      throw new Error(result.message);
    }
    return createVoteMutation.mutateAsync({ name });
  };

  return {
    votes: votesQuery.data ?? [],
    questionCounts,
    isLoading: votesQuery.isLoading,
    isCreating: createVoteMutation.isPending,
    errorMessage:
      votesQuery.error instanceof Error ? votesQuery.error.message : undefined,
    createErrorMessage:
      createVoteMutation.error instanceof Error
        ? createVoteMutation.error.message
        : undefined,
    createVote,
    refresh: () => votesQuery.refetch(),
  };
}
