import { Copy, Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
import { useVoteDetailQuery } from '../../api/query/useVoteDetailQuery';
import { AdminButton } from '../../components/AdminButton';
import { AdminHeader } from '../../components/AdminHeader';
import { AdminMessage } from '../../components/AdminMessage';
import './css/VoteSharePage.css';

export function VoteSharePage() {
  const { questionId = 'all', voteId = '' } = useParams();
  const voteDetail = useVoteDetailQuery(voteId);

  const copyLink = async () => {
    await voteDetail.copyParticipantUrl();
    toast.success('링크를 복사했습니다.');
  };

  const shareExternally = async () => {
    if (navigator.share) {
      await navigator.share({
        title: voteDetail.vote?.name ?? 'Taglow 투표',
        url: voteDetail.links.participantUrl,
      });
      return;
    }
    await copyLink();
  };

  const downloadQr = async () => {
    await voteDetail.downloadParticipantQr();
    toast.success('QR 다운로드를 준비했습니다.');
  };

  return (
    <section className="admin-screen share-screen">
      <AdminHeader
        backTo={
          questionId === 'all'
            ? `/admin/category/${voteId}`
            : `/admin/category/${voteId}/poll/${questionId}`
        }
        right={
          <button
            aria-label="QR 다운로드"
            className="header-icon-button"
            onClick={() => void downloadQr()}
            type="button"
          >
            <Download />
          </button>
        }
        title="공유하기"
      />

      <main className="share-body">
        <div className="share-intro">
          <h1>QR 코드로<br />투표를 공유하세요</h1>
          <p>참여자들이 쉽게 접근할 수 있습니다.</p>
        </div>

        {voteDetail.actionErrorMessage ? (
          <AdminMessage tone="danger">{voteDetail.actionErrorMessage}</AdminMessage>
        ) : null}

        <div className="share-qr-card" aria-label="참여자 QR 코드">
          <div>
            {voteDetail.links.participantQrPayload ? (
              <QRCodeSVG
                bgColor="transparent"
                fgColor="#111111"
                size={168}
                value={voteDetail.links.participantQrPayload}
              />
            ) : (
              <strong>QR CODE</strong>
            )}
          </div>
        </div>
      </main>

      <div className="bottom-cta share-actions">
        <AdminButton
          fullWidth
          icon={<Share2 size={18} />}
          onClick={() => void shareExternally()}
        >
          외부로 공유하기
        </AdminButton>
        <AdminButton
          fullWidth
          icon={<Copy size={18} />}
          onClick={() => void copyLink()}
          variant="secondary"
        >
          링크 복사
        </AdminButton>
      </div>
    </section>
  );
}
