import type { UseFormReturn } from 'react-hook-form';
import { AdminTextField } from '../../common/AdminTextField';

type QuestionFormValues = {
  title: string;
  detail: string;
};

export function QuestionForm({
  form,
}: {
  form: UseFormReturn<QuestionFormValues>;
}) {
  return (
    <>
      <AdminTextField
        label="질문 제목"
        placeholder="예: 가장 마음에 드는 이미지는?"
        {...form.register('title')}
      />
      <label className="field" htmlFor="question-detail">
        <span className="field-label">질문 설명</span>
        <textarea
          id="question-detail"
          className="field-input textarea"
          placeholder="현장 참여자가 이해할 수 있는 짧은 설명을 입력하세요."
          {...form.register('detail')}
        />
      </label>
    </>
  );
}
