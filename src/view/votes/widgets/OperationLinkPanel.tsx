import { Copy, ExternalLink, QrCode, ScanLine } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { AdminVoteLinks } from '../../../api/model';
import { AdminButton } from '../../common/AdminButton';

type OperationLinkPanelProps = {
  links: AdminVoteLinks;
  onCopyParticipantUrl(): void;
  onDownloadQr(): void;
  onCopyPlayerUrl(): void;
  onOpenPlayer(): void;
};

export function OperationLinkPanel({
  links,
  onCopyParticipantUrl,
  onCopyPlayerUrl,
  onDownloadQr,
  onOpenPlayer,
}: OperationLinkPanelProps) {
  const hasParticipantUrl = links.participantUrl.length > 0;
  const hasPlayerUrl = links.playerUrl.length > 0;

  return (
    <aside className="operation-panel">
      <div>
        <p className="eyebrow">Share</p>
        <h2>운영 링크</h2>
      </div>

      <div className="qr-preview" aria-label="참여자 QR 미리보기">
        <QRCodeSVG value={links.participantQrPayload} size={160} />
      </div>

      <div className="link-field">
        <span>Participant URL</span>
        <code>{links.participantUrl}</code>
        <AdminButton
          disabled={!hasParticipantUrl}
          icon={<Copy size={16} />}
          onClick={onCopyParticipantUrl}
          variant="secondary"
        >
          복사
        </AdminButton>
      </div>

      <AdminButton
        disabled={!hasParticipantUrl}
        icon={<QrCode size={16} />}
        onClick={onDownloadQr}
      >
        QR 다운로드
      </AdminButton>

      <div className="link-field">
        <span>Player URL</span>
        <code>{links.playerUrl}</code>
        <div className="button-row">
          <AdminButton
            disabled={!hasPlayerUrl}
            icon={<Copy size={16} />}
            onClick={onCopyPlayerUrl}
            variant="secondary"
          >
            복사
          </AdminButton>
          <AdminButton
            disabled={!hasPlayerUrl}
            icon={<ExternalLink size={16} />}
            onClick={onOpenPlayer}
            variant="secondary"
          >
            열기
          </AdminButton>
        </div>
      </div>

      <div className="hint-card">
        <ScanLine size={18} />
        <span>QR payload는 공개 participant URL만 사용합니다.</span>
      </div>
    </aside>
  );
}
