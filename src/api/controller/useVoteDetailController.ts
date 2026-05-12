import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { VoteStatus } from '../model';
import { useAdminRuntime } from '../service/adminRuntime';
import { queryKeys } from './queryKeys';

export function useVoteDetailController(voteId: string) {
  const {
    adminService,
    clipboard,
    externalLinkLauncher,
    qrExportService,
    urlBuilder,
  } = useAdminRuntime();
  const queryClient = useQueryClient();
  const [actionMessage, setActionMessage] = useState<string>();
  const [actionErrorMessage, setActionErrorMessage] = useState<string>();

  const voteQuery = useQuery({
    queryKey: queryKeys.vote(voteId),
    queryFn: () => adminService.fetchVote(voteId),
  });

  const questionsQuery = useQuery({
    queryKey: queryKeys.questions(voteId),
    queryFn: () => adminService.fetchQuestions(voteId),
  });

  const publicPreviewQuery = useQuery({
    queryKey: queryKeys.publicPreview(voteId),
    queryFn: async () => ({
      display: await adminService.fetchPublicVoteDisplay(voteId),
      questions: await adminService.fetchPublicQuestions(voteId),
    }),
    enabled: false,
  });

  const updateVoteMutation = useMutation({
    mutationFn: (input: { name?: string; status?: VoteStatus }) =>
      adminService.updateVote({ voteId, ...input }),
    onSuccess: async (vote) => {
      queryClient.setQueryData(queryKeys.vote(voteId), vote);
      await queryClient.invalidateQueries({ queryKey: queryKeys.votes });
    },
  });

  const deleteVoteMutation = useMutation({
    mutationFn: () => adminService.deleteVote(voteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.votes });
    },
  });

  const links = useMemo(() => urlBuilder.buildVoteLinks(voteId), [urlBuilder, voteId]);

  const runAction = async <T,>(
    action: () => Promise<T>,
    successMessage: string,
  ): Promise<T> => {
    setActionErrorMessage(undefined);
    try {
      const result = await action();
      setActionMessage(successMessage);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : '작업에 실패했습니다.';
      setActionErrorMessage(message);
      throw error;
    }
  };

  const copyParticipantUrl = () =>
    runAction(async () => {
      await clipboard.copyText(links.participantUrl);
      return links.participantUrl;
    }, '참여자 링크를 복사했습니다.');

  const copyPlayerUrl = () =>
    runAction(async () => {
      await clipboard.copyText(links.playerUrl);
      return links.playerUrl;
    }, 'player 링크를 복사했습니다.');

  const downloadParticipantQr = () =>
    runAction(async () => {
      const result = await qrExportService.downloadParticipantQr({
        voteId,
        payload: links.participantQrPayload,
      });
      return result.fileName;
    }, 'QR 파일을 저장했습니다.');

  const openPlayerInNewTab = () =>
    runAction(async () => {
      try {
        await externalLinkLauncher.openNewTab(links.playerUrl);
      } catch (error) {
        await clipboard.copyText(links.playerUrl);
        throw error;
      }
      return links.playerUrl;
    }, 'player를 새 창으로 열었습니다.');

  return {
    vote: voteQuery.data,
    questions: questionsQuery.data ?? [],
    links,
    publicPreview: publicPreviewQuery.data,
    isLoading: voteQuery.isLoading || questionsQuery.isLoading,
    isSaving: updateVoteMutation.isPending || deleteVoteMutation.isPending,
    isExportingQr: false,
    isRefreshingPublicPreview: publicPreviewQuery.isFetching,
    errorMessage:
      voteQuery.error instanceof Error
        ? voteQuery.error.message
        : questionsQuery.error instanceof Error
          ? questionsQuery.error.message
          : undefined,
    actionMessage,
    actionErrorMessage,
    refresh: async () => {
      await Promise.all([voteQuery.refetch(), questionsQuery.refetch()]);
    },
    updateVoteName: (name: string) => updateVoteMutation.mutateAsync({ name }),
    updateVoteStatus: (status: VoteStatus) =>
      updateVoteMutation.mutateAsync({ status }),
    deleteVote: () => deleteVoteMutation.mutateAsync(),
    copyParticipantUrl,
    copyPlayerUrl,
    downloadParticipantQr,
    openPlayerInNewTab,
    refreshPublicPreview: async () => {
      await publicPreviewQuery.refetch();
    },
  };
}
