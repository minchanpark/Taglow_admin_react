import type { ButtonHTMLAttributes, ReactNode } from 'react';

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark';
  icon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
};

export function AdminButton({
  children,
  className = '',
  fullWidth,
  icon,
  isLoading,
  variant = 'primary',
  ...props
}: AdminButtonProps) {
  return (
    <button
      className={`admin-button admin-button-${variant} ${fullWidth ? 'is-full' : ''} ${className}`}
      disabled={isLoading || props.disabled}
      type={props.type ?? 'button'}
      {...props}
    >
      {icon}
      <span>{isLoading ? '처리 중' : children}</span>
    </button>
  );
}
