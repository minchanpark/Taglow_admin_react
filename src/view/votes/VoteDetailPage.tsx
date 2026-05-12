import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useVoteDetailController } from '../../api/controller/useVoteDetailController';
import { AdminButton } from '../common/AdminButton';
import { AdminMessage } from '../common/AdminMessage';
import { AdminTextField } from '../common/AdminTextField';
import { OperationLinkPanel } from './widgets/OperationLinkPanel';
import { PublicPreviewPanel } from './widgets/PublicPreviewPanel';
import { QuestionGrid } from './widgets/QuestionGrid';
import { VoteStatusControl } from './widgets/VoteStatusControl';

export function VoteDetailPage() {
  const { voteId = '' } = useParams();
  const navigate = useNavigate();
  const controller = useVoteDetailController(voteId);
  const [nameDraft, setNameDraft] = useState('');

  if (controller.isLoading) {
    return <div className="list-skeleton">vote 상세를 불러오는 중입니다.</div>;
  }

  if (!controller.vote) {
    return <AdminMessage tone="danger">vote를 찾을 수 없습니다.</AdminMessage>;
  }

  const updateName = async () => {
    if (!nameDraft.trim()) return;
    await controller.updateVoteName(nameDraft);
    setNameDraft('');
  };

  const deleteVote = async () => {
    await controller.deleteVote();
    navigate('/votes', { replace: true });
  };

  return (
    <section className="detail-layout">
      <div className="detail-main">
        <div className="page-header">
          <div>
            <p className="eyebrow">Vote Detail</p>
            <h1>{controller.vote.name}</h1>
            <p>{controller.questions.length}개 question을 운영 중입니다.</p>
          </div>
          <Link className="admin-link-button" to={`/votes/${voteId}/questions/new`}>
            <Plus size={18} />
            question 추가
          </Link>
        </div>

        {controller.actionMessage ? (
          <AdminMessage tone="success">{controller.actionMessage}</AdminMessage>
        ) : null}
        {controller.actionErrorMessage ? (
          <AdminMessage tone="warning">{controller.actionErrorMessage}</AdminMessage>
        ) : null}
        {controller.errorMessage ? (
          <AdminMessage tone="danger">{controller.errorMessage}</AdminMessage>
        ) : null}

        <div className="control-panel">
          <VoteStatusControl
            isSaving={controller.isSaving}
            onChange={(status) => void controller.updateVoteStatus(status)}
            status={controller.vote.status}
          />
          <div className="rename-control">
            <AdminTextField
              label="Vote 이름 수정"
              onChange={(event) => setNameDraft(event.target.value)}
              placeholder={controller.vote.name}
              value={nameDraft}
            />
            <AdminButton
              icon={<Edit3 size={16} />}
              onClick={() => void updateName()}
              variant="secondary"
            >
              적용
            </AdminButton>
          </div>
          <AdminButton icon={<Trash2 size={16} />} onClick={deleteVote} variant="danger">
            vote 삭제
          </AdminButton>
        </div>

        <QuestionGrid questions={controller.questions} voteId={voteId} />
        <PublicPreviewPanel
          isLoading={controller.isRefreshingPublicPreview}
          onRefresh={() => void controller.refreshPublicPreview()}
          preview={controller.publicPreview}
        />
      </div>

      <OperationLinkPanel
        links={controller.links}
        onCopyParticipantUrl={() => void controller.copyParticipantUrl()}
        onCopyPlayerUrl={() => void controller.copyPlayerUrl()}
        onDownloadQr={() => void controller.downloadParticipantQr()}
        onOpenPlayer={() => void controller.openPlayerInNewTab()}
      />
    </section>
  );
}
