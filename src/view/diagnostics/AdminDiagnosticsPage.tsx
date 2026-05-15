import {
  ChevronRight,
  FileText,
  HelpCircle,
  Lock,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthQuery } from '../../api/query/useAuthQuery';
import { AdminButton } from '../../components/AdminButton';
import { AdminHeader } from '../../components/AdminHeader';
import { ConfirmModal } from './components/ConfirmModal';
import './css/AdminDiagnosticsPage.css';

type ModalKind = 'logout' | 'delete';

function SettingsRow({
  danger,
  icon,
  label,
  onClick,
  trailing,
}: {
  danger?: boolean;
  icon: ReactNode;
  label: string;
  onClick?(): void;
  trailing?: React.ReactNode;
}) {
  return (
    <button className={`settings-row ${danger ? 'danger' : ''}`} onClick={onClick} type="button">
      <span>{label}</span>
      {trailing ?? <ChevronRight />}
    </button>
  );
}

export function AdminDiagnosticsPage() {
  const auth = useAuthQuery();
  const navigate = useNavigate();
  const [modal, setModal] = useState<ModalKind>();
  const userName = auth.user?.name || 'operator';
  const initial = userName.slice(0, 1).toUpperCase();

  const confirmLogout = async () => {
    await auth.logout();
    setModal(undefined);
    navigate('/login', { replace: true });
  };

  const confirmDelete = async () => {
    await auth.deleteAccount();
    setModal(undefined);
    navigate('/signup', { replace: true });
  };

  return (
    <section className="admin-screen surface-screen">
      <AdminHeader backTo="/admin" title="설정" titleTone="black" />

      <main className="settings-body">
        <section className="profile-card">
          <div className="profile-avatar">{initial}</div>
          <div>
            <h1>{userName}</h1>
            <p>Taglow 관리자</p>
          </div>
        </section>

        <section className="settings-group">
          <p className="settings-caption">계정</p>
          <div className="settings-box">
            <SettingsRow icon={<Lock />} label="비밀번호 변경" />
          </div>
        </section>

        <section className="settings-group">
          <p className="settings-caption">기타</p>
          <div className="settings-box">
            <SettingsRow icon={<HelpCircle />} label="개인정보처리방침" />
            <div className="settings-divider" />
            <SettingsRow icon={<FileText />} label="이용약관" />
          </div>
        </section>

        <div className="settings-actions">
          <AdminButton
            fullWidth
            icon={<LogOut size={18} />}
            onClick={() => setModal('logout')}
            variant="secondary"
          >
            로그아웃
          </AdminButton>
          <AdminButton
            fullWidth
            icon={<ShieldAlert size={18} />}
            onClick={() => setModal('delete')}
            variant="danger"
          >
            회원탈퇴
          </AdminButton>
        </div>

        <footer className="settings-footer">© 2026 Taglow</footer>
      </main>

      <ConfirmModal
        actionLabel="로그아웃"
        description="현재 세션을 종료하고 로그인 화면으로 이동합니다."
        isOpen={modal === 'logout'}
        onClose={() => setModal(undefined)}
        onConfirm={() => void confirmLogout()}
        title="로그아웃할까요?"
      />
      <ConfirmModal
        actionLabel="회원탈퇴"
        description="현재 계정을 삭제하고 세션을 종료합니다."
        isOpen={modal === 'delete'}
        onClose={() => setModal(undefined)}
        onConfirm={() => void confirmDelete()}
        title="회원탈퇴할까요?"
        tone="danger"
      />
    </section>
  );
}
