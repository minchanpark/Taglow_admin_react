import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { AuthLayout } from '../components/AuthLayout';
import { LoginPage } from '../view/auth/LoginPage';
import { SignupPage } from '../view/auth/SignupPage';
import { AdminDiagnosticsPage } from '../view/diagnostics/AdminDiagnosticsPage';
import { QuestionEditorPage } from '../view/questions/QuestionEditorPage';
import { VoteCreatePage } from '../view/votes/VoteCreatePage';
import { VoteDetailPage } from '../view/votes/VoteDetailPage';
import { VoteListPage } from '../view/votes/VoteListPage';
import { VotePollDetailPage } from '../view/votes/VotePollDetailPage';
import { VoteSharePage } from '../view/votes/VoteSharePage';
import { useAuthController } from '../api/controller/useAuthController';

const SessionLoader = () => (
  <div className="screen-loader">
    <span>세션을 확인하는 중입니다.</span>
    <small>오래 걸리면 새로고침하거나 잠시 후 다시 시도해주세요.</small>
  </div>
);

function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useAuthController();
  const location = useLocation();

  if (auth.isCheckingSession) {
    return <SessionLoader />;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!auth.canManage) {
    return (
      <div className="screen-loader">
        <strong>운영 콘솔 접근 권한이 없습니다.</strong>
        <span>USER 또는 ADMIN role이 필요합니다.</span>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const auth = useAuthController();

  if (auth.canManage) {
    return <Navigate to="/admin" replace />;
  }

  return <AuthLayout>{children}</AuthLayout>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <VoteListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create"
        element={
          <ProtectedRoute>
            <VoteCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/category/:voteId"
        element={
          <ProtectedRoute>
            <VoteDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/category/:voteId/add-option"
        element={
          <ProtectedRoute>
            <QuestionEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/category/:voteId/poll/:questionId"
        element={
          <ProtectedRoute>
            <VotePollDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/category/:voteId/share/:questionId"
        element={
          <ProtectedRoute>
            <VoteSharePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <AdminDiagnosticsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/votes" element={<Navigate to="/admin" replace />} />
      <Route path="/votes/new" element={<Navigate to="/admin/create" replace />} />
      <Route path="/votes/:voteId" element={<NavigateToVoteDetail />} />
      <Route path="/votes/:voteId/questions/new" element={<NavigateToNewQuestion />} />
      <Route path="/votes/:voteId/questions/:questionId" element={<NavigateToPoll />} />
      <Route path="/diagnostics" element={<Navigate to="/admin/settings" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

function NavigateToVoteDetail() {
  const location = useLocation();
  const voteId = location.pathname.split('/').filter(Boolean).at(-1);
  return <Navigate to={voteId ? `/admin/category/${voteId}` : '/admin'} replace />;
}

function NavigateToNewQuestion() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  const voteId = parts.at(1);
  return <Navigate to={voteId ? `/admin/category/${voteId}/add-option` : '/admin'} replace />;
}

function NavigateToPoll() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  const voteId = parts.at(1);
  const questionId = parts.at(3);
  return (
    <Navigate
      to={
        voteId && questionId
          ? `/admin/category/${voteId}/poll/${questionId}`
          : '/admin'
      }
      replace
    />
  );
}
