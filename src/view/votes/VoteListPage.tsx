import { Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVoteListQuery } from '../../api/query/useVoteListQuery';
import { AdminMessage } from '../../components/AdminMessage';

const formatDate = (value?: string) => {
  if (!value) return '생성일 -';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '생성일 -';
  return `생성일 ${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(date.getDate()).padStart(2, '0')}`;
};

export function VoteListPage() {
  const controller = useVoteListQuery();

  return (
    <section className="admin-screen surface-screen">
      <header className="category-header">
        <div>
          <h1>투표 관리</h1>
          <p>총 {controller.votes.length}개의 카테고리</p>
        </div>
        <Link
          aria-label="설정"
          className="settings-icon-button"
          to="/admin/settings"
        >
          <Settings />
        </Link>
      </header>

      <main className="category-list">
        {controller.errorMessage ? (
          <AdminMessage tone="danger">{controller.errorMessage}</AdminMessage>
        ) : null}

        {controller.createErrorMessage ? (
          <AdminMessage tone="danger">{controller.createErrorMessage}</AdminMessage>
        ) : null}

        {controller.isLoading ? (
          <div className="list-skeleton">카테고리를 불러오는 중입니다.</div>
        ) : null}

        {!controller.isLoading && controller.votes.length === 0 ? (
          <div className="empty-state">
            <strong>아직 카테고리가 없습니다.</strong>
            <span>새 카테고리를 만들고 세부 항목을 추가해보세요.</span>
          </div>
        ) : null}

        {controller.votes.map((vote) => (
          <Link className="category-card" key={vote.id} to={`/admin/category/${vote.id}`}>
            <div className="category-card-top">
              <h2>{vote.name}</h2>
              <span>세부 항목 {controller.questionCounts.get(vote.id) ?? 0}개</span>
            </div>
            <p>{formatDate(vote.createdAt)}</p>
          </Link>
        ))}

        <Link className="category-create-card" to="/admin/create">
          <span>
            <Plus />
          </span>
          <strong>새로운 카테고리 만들기</strong>
        </Link>
      </main>
    </section>
  );
}
