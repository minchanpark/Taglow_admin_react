import type { ReactNode } from 'react';
import './css/AdminMessage.css';

type AdminMessageProps = {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  children: ReactNode;
};

export function AdminMessage({ children, tone = 'info' }: AdminMessageProps) {
  return <div className={`admin-message admin-message-${tone}`}>{children}</div>;
}
