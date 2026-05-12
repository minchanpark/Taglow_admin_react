import type { ReactNode } from 'react';
import { AdminButton } from '../../common/AdminButton';

type QuestionImagePickerProps = {
  icon?: ReactNode;
  isUploading: boolean;
  onSelect(file: File): void;
};

export function QuestionImagePicker({
  icon,
  isUploading,
  onSelect,
}: QuestionImagePickerProps) {
  return (
    <label className="image-picker">
      <span>
        <strong>Question 이미지</strong>
        <small>JPG, PNG, WEBP / 10MB 이하</small>
      </span>
      <input
        accept="image/jpeg,image/png,image/webp"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file);
        }}
        type="file"
      />
      <AdminButton icon={icon} isLoading={isUploading} variant="secondary">
        이미지 선택
      </AdminButton>
    </label>
  );
}
