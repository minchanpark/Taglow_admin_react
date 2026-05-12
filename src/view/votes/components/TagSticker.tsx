import type { ReactNode } from 'react';

type TagStickerProps = {
  children: ReactNode;
  className?: string;
  label: string;
  onClick(): void;
  style?: React.CSSProperties;
};

export function TagSticker({
  children,
  className = '',
  label,
  onClick,
  style,
}: TagStickerProps) {
  return (
    <button
      aria-label={label}
      className={`tag-sticker ${className}`}
      onClick={onClick}
      style={style}
      type="button"
    >
      <span className="tag-sticker-inner">{children}</span>
    </button>
  );
}
