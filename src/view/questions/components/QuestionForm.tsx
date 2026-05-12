import type { UseFormReturn } from 'react-hook-form';
import { AdminTextField } from '../../../components/AdminTextField';

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
        label="항목 제목"
        placeholder="예: 포토존 A"
        {...form.register('title')}
      />
      <label className="field" htmlFor="question-detail">
        <span className="field-label">설명 (선택)</span>
        <textarea
          id="question-detail"
          className="field-input textarea"
          placeholder="참여자가 이해할 수 있는 짧은 설명"
          {...form.register('detail')}
        />
      </label>
    </>
  );
}
