import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { LoginPage } from '../view/auth/LoginPage';
import { SignupPage } from '../view/auth/SignupPage';
import { AdminDiagnosticsPage } from '../view/diagnostics/AdminDiagnosticsPage';
import { QuestionEditorPage } from '../view/questions/QuestionEditorPage';
import { AdminShell } from '../view/common/AdminShell';
import { VoteCreatePage } from '../view/votes/VoteCreatePage';
import { VoteDetailPage } from '../view/votes/VoteDetailPage';
import { VoteListPage } from '../view/votes/VoteListPage';
import { useAuthController } from '../api/controller/useAuthController';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useAuthController();
  const location = useLocation();

  if (auth.isCheckingSession) {
    return <div className="screen-loader">세션을 확인하는 중입니다.</div>;
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

  return <AdminShell>{children}</AdminShell>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const auth = useAuthController();

  if (auth.isCheckingSession) {
    return <div className="screen-loader">세션을 확인하는 중입니다.</div>;
  }

  if (auth.canManage) {
    return <Navigate to="/votes" replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/votes" replace />} />
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
        path="/votes"
        element={
          <ProtectedRoute>
            <VoteListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/votes/new"
        element={
          <ProtectedRoute>
            <VoteCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/votes/:voteId"
        element={
          <ProtectedRoute>
            <VoteDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/votes/:voteId/questions/new"
        element={
          <ProtectedRoute>
            <QuestionEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/votes/:voteId/questions/:questionId"
        element={
          <ProtectedRoute>
            <QuestionEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diagnostics"
        element={
          <ProtectedRoute>
            <AdminDiagnosticsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/votes" replace />} />
    </Routes>
  );
}
