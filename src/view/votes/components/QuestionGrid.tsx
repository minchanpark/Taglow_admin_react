import { ImageOff, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { AdminQuestion } from '../../../api/model';
import './css/QuestionGrid.css';

type QuestionGridProps = {
  questions: AdminQuestion[];
  voteId: string;
};

export function QuestionGrid({ questions, voteId }: QuestionGridProps) {
  return (
    <div className="option-grid">
      {questions.map((question) => (
        <Link
          className="option-card"
          key={question.id}
          to={`/admin/category/${voteId}/poll/${question.id}`}
        >
          <div className="option-thumb">
            {question.imageUrl ? (
              <img alt="" src={question.imageUrl} />
            ) : (
              <ImageOff />
            )}
          </div>
          <h2>{question.title}</h2>
          <span>{question.tagCount ?? 0}명 참여</span>
        </Link>
      ))}

      <Link className="option-add-card" to={`/admin/category/${voteId}/add-option`}>
        <span>
          <Plus />
        </span>
        <strong>항목 추가</strong>
      </Link>
    </div>
  );
}
