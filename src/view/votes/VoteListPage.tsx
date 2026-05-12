import { Plus, RefreshCw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useVoteListController } from '../../api/controller/useVoteListController';
import { AdminButton } from '../common/AdminButton';
import { AdminMessage } from '../common/AdminMessage';
import { AdminTextField } from '../common/AdminTextField';

type CreateVoteForm = {
  name: string;
};

export function VoteListPage() {
  const controller = useVoteListController();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { handleSubmit, register, reset } = useForm<CreateVoteForm>();

  const filteredVotes = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return controller.votes;
    return controller.votes.filter((vote) =>
      vote.name.toLowerCase().includes(keyword),
    );
  }, [controller.votes, search]);

  const submit = handleSubmit(async (values) => {
    const vote = await controller.createVote(values.name);
    reset();
    navigate(`/votes/${vote.id}`);
  });

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Vote Operations</p>
          <h1>Vote 목록</h1>
          <p>현장 투표를 만들고 question, QR, player 링크를 관리합니다.</p>
        </div>
        <Link className="admin-link-button" to="/votes/new">
          <Plus size={18} />
          새 vote
        </Link>
      </div>

      <div className="toolbar">
        <label className="search-box">
          <Search size={18} />
          <input
            aria-label="vote 검색"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="vote 이름 검색"
            value={search}
          />
        </label>
        <AdminButton
          icon={<RefreshCw size={16} />}
          onClick={() => void controller.refresh()}
          variant="secondary"
        >
          새로고침
        </AdminButton>
      </div>

      <form className="inline-create" onSubmit={submit}>
        <AdminTextField
          label="빠른 vote 생성"
          placeholder="예: 여름 팝업 현장 투표"
          {...register('name')}
        />
        <AdminButton
          icon={<Plus size={18} />}
          isLoading={controller.isCreating}
          type="submit"
        >
          생성
        </AdminButton>
      </form>
      {controller.createErrorMessage ? (
        <AdminMessage tone="danger">{controller.createErrorMessage}</AdminMessage>
      ) : null}

      {controller.errorMessage ? (
        <AdminMessage tone="danger">{controller.errorMessage}</AdminMessage>
      ) : null}

      {controller.isLoading ? (
        <div className="list-skeleton">vote 목록을 불러오는 중입니다.</div>
      ) : filteredVotes.length === 0 ? (
        <div className="empty-state">
          <strong>표시할 vote가 없습니다.</strong>
          <span>새 vote를 만들면 participant QR과 player 링크를 준비할 수 있습니다.</span>
        </div>
      ) : (
        <div className="vote-grid">
          {filteredVotes.map((vote) => (
            <Link className="vote-card" key={vote.id} to={`/votes/${vote.id}`}>
              <div>
                <span className={`status-pill status-${vote.status.toLowerCase()}`}>
                  {vote.status}
                </span>
                <h2>{vote.name}</h2>
                <p>{controller.questionCounts.get(vote.id) ?? 0} questions</p>
              </div>
              <small>{vote.isMine ? '내가 생성한 vote' : '공유 vote'}</small>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
