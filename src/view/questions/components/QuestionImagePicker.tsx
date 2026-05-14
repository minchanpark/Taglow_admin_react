import { ImagePlus } from 'lucide-react';
import './css/QuestionImagePicker.css';

type QuestionImagePickerProps = {
  isUploading: boolean;
  previewUrl?: string;
  onSelect(file: File): void;
};

export function QuestionImagePicker({
  isUploading,
  onSelect,
  previewUrl,
}: QuestionImagePickerProps) {
  return (
    <label className="poster-uploader">
      <span className="field-label">포스터 이미지</span>
      <input
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file);
        }}
        type="file"
      />
      <span className="poster-upload-box">
        {previewUrl ? (
          <img alt="" src={previewUrl} />
        ) : (
          <span className="poster-empty-state">
            <span>
              <ImagePlus />
            </span>
            <strong>
              {isUploading ? '이미지를 업로드하는 중입니다' : '이미지를 업로드하려면 탭하세요'}
            </strong>
          </span>
        )}
      </span>
    </label>
  );
}
