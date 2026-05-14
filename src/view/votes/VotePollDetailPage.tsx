import { ChevronLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useVoteDetailQuery } from '../../api/query/useVoteDetailQuery';
import { AdminMessage } from '../../components/AdminMessage';
import './css/VotePollDetailPage.css';

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

const tagLocationToPercent = (value: number) =>
  `${clampPercent(value >= 0 && value <= 1 ? value * 100 : value)}%`;

export function VotePollDetailPage() {
  const { questionId = '', voteId = '' } = useParams();
  const navigate = useNavigate();
  const voteDetail = useVoteDetailQuery(voteId);

  if (voteDetail.isLoading) {
    return <div className="list-skeleton full-screen dark">상세 화면을 불러오는 중입니다.</div>;
  }

  const question = voteDetail.questions.find((item) => item.id === questionId);

  if (!voteDetail.vote || !question) {
    return (
      <section className="sticker-detail-screen">
        <AdminMessage tone="danger">항목을 찾을 수 없습니다.</AdminMessage>
      </section>
    );
  }

  const tags = question.tags ?? [];

  return (
    <section className="sticker-detail-screen">
      <img alt="" className="sticker-bg-image" src={question.imageUrl} />
      <div className="sticker-bg-overlay" />

      <div className="tag-dot-layer" aria-label="저장된 태그 위치">
        {tags.map((tag, index) => (
          <span
            aria-label={`태그 위치 ${index + 1}`}
            className="tag-location-dot"
            key={tag.id}
            style={{
              left: tagLocationToPercent(tag.locationX),
              top: tagLocationToPercent(tag.locationY),
            }}
            title={`태그 위치 ${index + 1}`}
          />
        ))}
      </div>

      <header className="sticker-overlay-header">
        <button className="sticker-back-button" onClick={() => navigate(`/admin/category/${voteId}`)} type="button">
          <ChevronLeft />
          <span>목록</span>
        </button>
        <strong>{question.title}</strong>
        <Link className="sticker-share-pill" to={`/admin/category/${voteId}/share/${questionId}`}>
          공유
        </Link>
      </header>
    </section>
  );
}
