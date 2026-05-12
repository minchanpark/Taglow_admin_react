import { RefreshCw } from 'lucide-react';
import { AdminButton } from '../../common/AdminButton';

type PublicPreviewPanelProps = {
  preview?: {
    display?: Record<string, unknown>;
    questions?: Array<Record<string, unknown>>;
  };
  isLoading: boolean;
  onRefresh(): void;
};

export function PublicPreviewPanel({
  isLoading,
  onRefresh,
  preview,
}: PublicPreviewPanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Public API</p>
          <h2>Quick check</h2>
        </div>
        <AdminButton
          icon={<RefreshCw size={16} />}
          isLoading={isLoading}
          onClick={onRefresh}
          variant="secondary"
        >
          확인
        </AdminButton>
      </div>
      {preview ? (
        <div className="preview-grid">
          <pre>{JSON.stringify(preview.display, null, 2)}</pre>
          <pre>{JSON.stringify(preview.questions, null, 2)}</pre>
        </div>
      ) : (
        <p className="muted">저장된 데이터가 public display/questions API에서 보이는지 확인합니다.</p>
      )}
    </section>
  );
}
