import { Share2, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useVoteDetailController } from '../../api/controller/useVoteDetailController';
import { AdminButton } from '../../components/AdminButton';
import { AdminHeader } from '../../components/AdminHeader';
import { AdminMessage } from '../../components/AdminMessage';
import { QuestionGrid } from './components/QuestionGrid';
import { VoteStatusControl } from './components/VoteStatusControl';

export function VoteDetailPage() {
  const { voteId = '' } = useParams();
  const navigate = useNavigate();
  const controller = useVoteDetailController(voteId);

  if (controller.isLoading) {
    return <div className="list-skeleton full-screen">세부 항목을 불러오는 중입니다.</div>;
  }

  if (!controller.vote) {
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
    await controller.deleteVote();
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
        title={controller.vote.name}
      />

      <main className="admin-body">
        <div className="detail-intro">
          <h1>세부 항목 관리</h1>
          <p>{controller.questions.length}개의 항목이 준비되어 있습니다.</p>
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

        <QuestionGrid questions={controller.questions} voteId={voteId} />

        <section className="settings-group">
          <p className="settings-caption">운영 상태</p>
          <div className="settings-box padded">
            <VoteStatusControl
              isSaving={controller.isSaving}
              onChange={(status) => void controller.updateVoteStatus(status)}
              status={controller.vote.status}
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
