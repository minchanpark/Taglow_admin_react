import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAdminApiController } from '../runtime/adminRuntime';
import { queryKeys } from './queryKeys';
import { validateRequired } from '../../utils';

export function useVoteListQuery() {
  const adminApiController = useAdminApiController();
  const queryClient = useQueryClient();

  const votesQuery = useQuery({
    queryKey: queryKeys.votes,
    queryFn: () => adminApiController.fetchVotes(),
  });

  const questionCountQueries = useQueries({
    queries: (votesQuery.data ?? []).map((vote) => ({
      queryKey: queryKeys.questions(vote.id),
      queryFn: () => adminApiController.fetchQuestions(vote.id),
      enabled: votesQuery.isSuccess,
    })),
  });

  const createVoteMutation = useMutation({
    mutationFn: (input: { name: string }) => adminApiController.createVote(input),
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
