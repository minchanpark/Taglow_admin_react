import { ImageOff, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AdminQuestion } from '../../../api/model';

type QuestionGridProps = {
  questions: AdminQuestion[];
  voteId: string;
};

export function QuestionGrid({ questions, voteId }: QuestionGridProps) {
  if (questions.length === 0) {
    return (
      <div className="empty-state">
        <strong>아직 question이 없습니다.</strong>
        <span>이미지를 업로드하고 첫 question을 저장하세요.</span>
      </div>
    );
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Questions</p>
          <h2>Question 목록</h2>
        </div>
      </div>
      <div className="question-grid">
        {questions.map((question) => (
          <article className="question-card" key={question.id}>
            <div className="question-image">
              {question.imageUrl ? (
                <img alt="" src={question.imageUrl} />
              ) : (
                <ImageOff size={32} />
              )}
            </div>
            <div className="question-card-body">
              <h3>{question.title}</h3>
              <p>{question.detail}</p>
              <span>ratio {question.imageRatio.toFixed(2)}</span>
            </div>
            <Link
              className="admin-link-button subtle"
              to={`/votes/${voteId}/questions/${question.id}`}
            >
              <Pencil size={16} />
              수정
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
