import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useVoteDetailQuery } from '../../api/query/useVoteDetailQuery';
import { AdminButton } from '../../components/AdminButton';
import { AdminHeader } from '../../components/AdminHeader';
import { AdminMessage } from '../../components/AdminMessage';
import { QuestionGrid } from './components/QuestionGrid';
import { VoteStatusControl } from './components/VoteStatusControl';
import './css/VoteDetailPage.css';

export function VoteDetailPage() {
  const { voteId = '' } = useParams();
  const navigate = useNavigate();
  const voteDetail = useVoteDetailQuery(voteId);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (voteDetail.isLoading) {
    return <div className="list-skeleton full-screen">세부 항목을 불러오는 중입니다.</div>;
  }

  if (!voteDetail.vote) {
    return (
      <section className="admin-screen surface-screen">
        <AdminHeader backTo="/admin" title="세부 항목" />
        <main className="admin-body">
          <AdminMessage tone="danger">카테고리를 찾을 수 없습니다.</AdminMessage>
        </main>
      </section>
    );
  }

  const deleteVote = async () => {
    await voteDetail.deleteVote();
    navigate('/admin', { replace: true });
  };

  const confirmDeleteVote = () => {
    void deleteVote();
  };

  return (
    <section className="admin-screen surface-screen">
      <AdminHeader
        backTo="/admin"
        right={
          <Link
            aria-label="공유하기"
            className="header-icon-button"
            to={`/admin/category/${voteId}/share/all`}
          >
            <Share2 />
          </Link>
        }
        title={voteDetail.vote.name}
      />

      <main className="admin-body">
        <div className="detail-intro">
          <h1>세부 항목 관리</h1>
          <p>{voteDetail.questions.length}개의 항목이 준비되어 있습니다.</p>
        </div>

        {voteDetail.actionMessage ? (
          <AdminMessage tone="success">{voteDetail.actionMessage}</AdminMessage>
        ) : null}
        {voteDetail.actionErrorMessage ? (
          <AdminMessage tone="warning">{voteDetail.actionErrorMessage}</AdminMessage>
        ) : null}
        {voteDetail.errorMessage ? (
          <AdminMessage tone="danger">{voteDetail.errorMessage}</AdminMessage>
        ) : null}

        <QuestionGrid questions={voteDetail.questions} voteId={voteId} />

        <section className="settings-group">
          <p className="settings-caption">운영 상태</p>
          <div className="settings-box padded">
            <VoteStatusControl
              isSaving={voteDetail.isSaving}
              onChange={(status) => void voteDetail.updateVoteStatus(status)}
              status={voteDetail.vote.status}
            />
          </div>
        </section>

        <AdminButton
          className="settings-danger-button"
          isLoading={voteDetail.isSaving}
          onClick={() => setIsDeleteConfirmOpen(true)}
          variant="danger"
        >
          카테고리 삭제
        </AdminButton>
      </main>

      {isDeleteConfirmOpen ? (
        <div className="delete-confirm-backdrop" onClick={() => setIsDeleteConfirmOpen(false)}>
          <section
            aria-labelledby="delete-confirm-title"
            aria-modal="true"
            className="delete-confirm-popup"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >

            <h2 id="delete-confirm-title" className="delete-confirm-title">정말 삭제하시겠습니까?</h2>
            <div className="delete-confirm-actions">
              <AdminButton
                disabled={voteDetail.isSaving}
                onClick={confirmDeleteVote}
                variant="danger"
              >
                예
              </AdminButton>
              <AdminButton
                disabled={voteDetail.isSaving}
                onClick={() => setIsDeleteConfirmOpen(false)}
                variant="secondary"
              >
                아니오
              </AdminButton>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
