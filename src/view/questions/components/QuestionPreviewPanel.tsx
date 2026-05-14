import { ImageIcon } from 'lucide-react';
import type { QuestionImageUploadResult } from '../../../api/model';
import './css/QuestionPreviewPanel.css';

type QuestionPreviewPanelProps = {
  imageUrl?: string;
  imageRatio?: number;
  uploadResult?: QuestionImageUploadResult;
};

export function QuestionPreviewPanel({
  imageRatio,
  imageUrl,
  uploadResult,
}: QuestionPreviewPanelProps) {
  return (
    <aside className="preview-panel">
      <div>
        <p className="eyebrow">Preview</p>
        <h2>이미지 미리보기</h2>
      </div>
      <div className="preview-image">
        {imageUrl ? <img alt="" src={imageUrl} /> : <ImageIcon size={42} />}
      </div>
      <dl className="meta-list">
        <div>
          <dt>imageRatio</dt>
          <dd>{imageRatio ? imageRatio.toFixed(4) : '-'}</dd>
        </div>
        <div>
          <dt>publicUrl</dt>
          <dd>{uploadResult?.publicUrl ?? imageUrl ?? '-'}</dd>
        </div>
        <div>
          <dt>size</dt>
          <dd>{uploadResult ? `${Math.round(uploadResult.sizeBytes / 1024)} KB` : '-'}</dd>
        </div>
      </dl>
    </aside>
  );
}
