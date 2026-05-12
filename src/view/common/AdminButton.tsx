import type { ButtonHTMLAttributes, ReactNode } from 'react';

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
  isLoading?: boolean;
};

export function AdminButton({
  children,
  className = '',
  icon,
  isLoading,
  variant = 'primary',
  ...props
}: AdminButtonProps) {
  return (
    <button
      className={`admin-button admin-button-${variant} ${className}`}
      disabled={isLoading || props.disabled}
      type={props.type ?? 'button'}
      {...props}
    >
      {icon}
      <span>{isLoading ? '처리 중' : children}</span>
    </button>
  );
}
