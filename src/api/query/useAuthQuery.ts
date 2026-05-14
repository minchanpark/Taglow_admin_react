import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { canUseAdminConsole } from '../model';
import { useAdminRuntime } from '../runtime/adminRuntime';
import { queryKeys } from './queryKeys';
import { debugAuthFlow, validateName, validatePassword } from '../../utils';

export function useAuthQuery() {
  const { adminApiController } = useAdminRuntime();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const sessionQuery = useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: async () => {
      debugAuthFlow('useAuthQuery.session.start', {
        queryKey: queryKeys.currentUser.join('/'),
      });
      const currentUser = await adminApiController.fetchCurrentUser();
      debugAuthFlow('useAuthQuery.session.result', {
        hasUser: Boolean(currentUser),
        roleCount: currentUser?.roles.size ?? 0,
      });
      return currentUser;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (input: { name: string; password: string }) => {
      debugAuthFlow('useAuthQuery.loginMutation.start', {
        hasName: Boolean(input.name.trim()),
        hasPassword: Boolean(input.password),
      });
      const user = await adminApiController.login(input);
      debugAuthFlow('useAuthQuery.loginMutation.result', {
        userId: user.id,
        roleCount: user.roles.size,
      });
      return user;
    },
    onSuccess: (user) => {
      debugAuthFlow('useAuthQuery.loginMutation.cacheUser', {
        userId: user.id,
        roleCount: user.roles.size,
      });
      queryClient.setQueryData(queryKeys.currentUser, user);
    },
    onError: (error) => {
      debugAuthFlow('useAuthQuery.loginMutation.error', {
        message: error instanceof Error ? error.message : 'unknown error',
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: (input: { name: string; password: string }) =>
      adminApiController.signup(input),
  });

  const logoutMutation = useMutation({
    mutationFn: () => adminApiController.logout(),
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(queryKeys.currentUser, null);
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => adminApiController.deleteCurrentUser(),
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
    debugAuthFlow('useAuthQuery.login.called', {
      hasName: Boolean(input.name.trim()),
      hasPassword: Boolean(input.password),
    });
    clearMessages();
    if (!input.name.trim()) {
      debugAuthFlow('useAuthQuery.login.validationBlocked', { field: 'name' });
      setErrorMessage('아이디를 입력해주세요.');
      return false;
    }
    if (!input.password) {
      debugAuthFlow('useAuthQuery.login.validationBlocked', { field: 'password' });
      setErrorMessage('비밀번호를 입력해주세요.');
      return false;
    }

    try {
      debugAuthFlow('useAuthQuery.login.submitMutation');
      const nextUser = await loginMutation.mutateAsync(input);
      debugAuthFlow('useAuthQuery.login.roleCheck', {
        userId: nextUser.id,
        roleCount: nextUser.roles.size,
        canUseAdminConsole: canUseAdminConsole(nextUser),
      });
      if (!canUseAdminConsole(nextUser)) {
        setErrorMessage('운영 콘솔 접근 권한이 없습니다.');
        debugAuthFlow('useAuthQuery.login.roleRejected', { userId: nextUser.id });
        await adminApiController.logout();
        queryClient.setQueryData(queryKeys.currentUser, null);
        return false;
      }
      setSuccessMessage('로그인되었습니다.');
      debugAuthFlow('useAuthQuery.login.success', { userId: nextUser.id });
      return true;
    } catch (error) {
      debugAuthFlow('useAuthQuery.login.error', {
        message: error instanceof Error ? error.message : 'unknown error',
      });
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
    isCheckingSession: sessionQuery.isLoading && !sessionQuery.isError,
    isSubmitting:
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending ||
      deleteAccountMutation.isPending,
    errorMessage,
    successMessage,
    login,
    signup,
    logout: () => logoutMutation.mutateAsync(),
    deleteAccount: () => deleteAccountMutation.mutateAsync(),
    clearMessages,
  };
}
