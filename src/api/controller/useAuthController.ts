import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { canUseAdminConsole } from '../model';
import { useAdminService } from '../service/adminRuntime';
import { queryKeys } from './queryKeys';
import { validateName, validatePassword } from '../../utils';

export function useAuthController() {
  const adminService = useAdminService();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const sessionQuery = useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => adminService.fetchCurrentUser(),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (input: { name: string; password: string }) =>
      adminService.login(input),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.currentUser, user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: (input: { name: string; password: string }) =>
      adminService.signup(input),
  });

  const logoutMutation = useMutation({
    mutationFn: () => adminService.logout(),
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(queryKeys.currentUser, null);
    },
  });

  const user = sessionQuery.data ?? null;
  const canManage = useMemo(() => {
    return user ? canUseAdminConsole(user) : false;
  }, [user]);

  const clearMessages = () => {
    setErrorMessage(undefined);
    setSuccessMessage(undefined);
  };

  const login = async (input: { name: string; password: string }) => {
    clearMessages();
    const nameResult = validateName(input.name);
    if (!nameResult.isValid) {
      setErrorMessage(nameResult.message);
      return false;
    }
    const passwordResult = validatePassword(input.password);
    if (!passwordResult.isValid) {
      setErrorMessage(passwordResult.message);
      return false;
    }

    try {
      const nextUser = await loginMutation.mutateAsync(input);
      if (!canUseAdminConsole(nextUser)) {
        setErrorMessage('운영 콘솔 접근 권한이 없습니다.');
        await adminService.logout();
        queryClient.setQueryData(queryKeys.currentUser, null);
        return false;
      }
      setSuccessMessage('로그인되었습니다.');
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '로그인에 실패했습니다.');
      return false;
    }
  };

  const signup = async (input: {
    name: string;
    password: string;
    passwordConfirm: string;
  }) => {
    clearMessages();
    const nameResult = validateName(input.name);
    if (!nameResult.isValid) {
      setErrorMessage(nameResult.message);
      return false;
    }
    const passwordResult = validatePassword(input.password);
    if (!passwordResult.isValid) {
      setErrorMessage(passwordResult.message);
      return false;
    }
    if (input.password !== input.passwordConfirm) {
      setErrorMessage('비밀번호 확인이 일치하지 않습니다.');
      return false;
    }

    try {
      await signupMutation.mutateAsync({
        name: input.name,
        password: input.password,
      });
      setSuccessMessage('회원가입이 완료되었습니다. 로그인해주세요.');
      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : '회원가입에 실패했습니다.',
      );
      return false;
    }
  };

  return {
    user,
    canManage,
    isCheckingSession: sessionQuery.isLoading,
    isSubmitting:
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending,
    errorMessage,
    successMessage,
    login,
    signup,
    logout: () => logoutMutation.mutateAsync(),
    clearMessages,
  };
}
