import {
  BarChart3,
  ClipboardList,
  LogOut,
  Menu,
  Settings,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthController } from '../../api/controller/useAuthController';
import { useUiStore } from '../../store/uiStore';
import { AdminButton } from './AdminButton';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const auth = useAuthController();
  const navigate = useNavigate();
  const { isSidebarCollapsed, toggleSidebar } = useUiStore();

  const logout = async () => {
    await auth.logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={`admin-shell ${isSidebarCollapsed ? 'is-collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="brand-block">
          <div className="brand-mark">T</div>
          <div>
            <strong>Taglow</strong>
            <span>Admin Console</span>
          </div>
        </div>
        <nav className="side-nav" aria-label="관리 메뉴">
          <NavLink to="/votes">
            <ClipboardList size={18} />
            <span>Votes</span>
          </NavLink>
          <NavLink to="/diagnostics">
            <Settings size={18} />
            <span>Diagnostics</span>
          </NavLink>
          <a href="https://taglow-player.web.app" target="_blank" rel="noreferrer">
            <BarChart3 size={18} />
            <span>Player</span>
          </a>
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <AdminButton
            aria-label="사이드바 접기"
            icon={<Menu size={18} />}
            onClick={toggleSidebar}
            variant="ghost"
          />
          <div className="topbar-user">
            <span>{auth.user?.name}</span>
            <small>{auth.user ? Array.from(auth.user.roles).join(', ') : ''}</small>
          </div>
          <AdminButton
            icon={<LogOut size={16} />}
            onClick={logout}
            variant="secondary"
          >
            로그아웃
          </AdminButton>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
