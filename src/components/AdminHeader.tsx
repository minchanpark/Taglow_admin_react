import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css';

type AdminHeaderProps = {
  title: string;
  titleTone?: 'gray' | 'black';
  right?: ReactNode;
  backTo?: string;
  showBack?: boolean;
};

export function AdminHeader({
  backTo,
  right,
  showBack = true,
  title,
  titleTone = 'gray',
}: AdminHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="mobile-header">
      {showBack ? (
        <button
          aria-label="뒤로가기"
          className="header-icon-button"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          type="button"
        >
          <ChevronLeft />
        </button>
      ) : (
        <span className="header-placeholder" />
      )}
      <h1 className={`mobile-header-title title-${titleTone}`}>{title}</h1>
      {right ?? <span className="header-placeholder" />}
    </header>
  );
}
