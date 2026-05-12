import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AdminQuestion, QuestionImageUploadResult } from '../model';
import { useAdminRuntime } from '../service/adminRuntime';
import { queryKeys } from './queryKeys';
import { validateRequired } from '../../utils';

export function useQuestionEditorController(input: {
  voteId: string;
  questionId?: string;
}) {
  const { adminService, imagePickerService, imageUploadService } = useAdminRuntime();
  const queryClient = useQueryClient();
  const [uploadResult, setUploadResult] = useState<QuestionImageUploadResult>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>();
  const [saveErrorMessage, setSaveErrorMessage] = useState<string>();

  const questionsQuery = useQuery({
    queryKey: queryKeys.questions(input.voteId),
    queryFn: () => adminService.fetchQuestions(input.voteId),
  });

  const question = useMemo<AdminQuestion | undefined>(() => {
    return questionsQuery.data?.find((item) => item.id === input.questionId);
  }, [input.questionId, questionsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: (payload: {
      title: string;
      detail: string;
      imageUrl: string;
      imageRatio: number;
    }) => {
      if (input.questionId) {
        return adminService.updateQuestion({
          questionId: input.questionId,
          ...payload,
        });
      }
      return adminService.createQuestion({
        voteId: input.voteId,
        ...payload,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.questions(input.voteId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.vote(input.voteId) }),
      ]);
    },
  });

  const selectImage = async (file: File) => {
    setUploadErrorMessage(undefined);
    try {
      const selection = await imagePickerService.pickQuestionImage(file);
      const nextUploadResult =
        await imageUploadService.uploadQuestionImage(selection);
      setUploadResult(nextUploadResult);
      setPreviewUrl(nextUploadResult.publicUrl);
      return nextUploadResult;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.';
      setUploadErrorMessage(message);
      throw error;
    }
  };

  const saveQuestion = async (payload: {
    title: string;
    detail: string;
    imageUrl?: string;
    imageRatio?: number;
  }) => {
    setSaveErrorMessage(undefined);
    const titleResult = validateRequired(payload.title, '질문 제목');
    if (!titleResult.isValid) {
      setSaveErrorMessage(titleResult.message);
      throw new Error(titleResult.message);
    }
    const imageUrl = uploadResult?.publicUrl ?? payload.imageUrl ?? question?.imageUrl;
    const imageRatio =
      uploadResult?.imageRatio ?? payload.imageRatio ?? question?.imageRatio;
    if (!imageUrl || !imageRatio) {
      const message = 'question 이미지를 업로드해주세요.';
      setSaveErrorMessage(message);
      throw new Error(message);
    }

    try {
      return await saveMutation.mutateAsync({
        title: payload.title,
        detail: payload.detail.trim(),
        imageUrl,
        imageRatio,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'question 저장에 실패했습니다.';
      setSaveErrorMessage(message);
      throw error;
    }
  };

  return {
    question,
    uploadResult,
    previewUrl: previewUrl ?? question?.imageUrl,
    imageRatio: uploadResult?.imageRatio ?? question?.imageRatio,
    isLoading: questionsQuery.isLoading,
    isUploading: false,
    isSaving: saveMutation.isPending,
    uploadErrorMessage,
    saveErrorMessage,
    selectImage,
    saveQuestion,
    clearSelection: () => {
      setUploadResult(undefined);
      setPreviewUrl(undefined);
    },
  };
}
