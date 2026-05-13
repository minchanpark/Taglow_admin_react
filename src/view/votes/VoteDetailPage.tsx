import { Share2, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useVoteDetailQuery } from '../../api/query/useVoteDetailQuery';
import { AdminButton } from '../../components/AdminButton';
import { AdminHeader } from '../../components/AdminHeader';
import { AdminMessage } from '../../components/AdminMessage';
import { QuestionGrid } from './components/QuestionGrid';
import { VoteStatusControl } from './components/VoteStatusControl';

export function VoteDetailPage() {
  const { voteId = '' } = useParams();
  const navigate = useNavigate();
  const voteDetail = useVoteDetailQuery(voteId);

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
          icon={<Trash2 size={18} />}
          onClick={deleteVote}
          variant="danger"
        >
          카테고리 삭제
        </AdminButton>
      </main>
    </section>
  );
}
