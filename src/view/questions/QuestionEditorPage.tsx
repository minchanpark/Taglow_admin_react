import { Save, Upload } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuestionEditorController } from '../../api/controller/useQuestionEditorController';
import { AdminButton } from '../common/AdminButton';
import { AdminMessage } from '../common/AdminMessage';
import { QuestionForm } from './widgets/QuestionForm';
import { QuestionImagePicker } from './widgets/QuestionImagePicker';
import { QuestionPreviewPanel } from './widgets/QuestionPreviewPanel';

type QuestionFormValues = {
  title: string;
  detail: string;
};

export function QuestionEditorPage() {
  const { questionId, voteId = '' } = useParams();
  const navigate = useNavigate();
  const controller = useQuestionEditorController({ voteId, questionId });
  const form = useForm<QuestionFormValues>({
    defaultValues: { title: '', detail: '' },
  });

  useEffect(() => {
    if (controller.question) {
      form.reset({
        title: controller.question.title,
        detail: controller.question.detail,
      });
    }
  }, [controller.question, form]);

  const submit = form.handleSubmit(async (values) => {
    await controller.saveQuestion(values);
    navigate(`/votes/${voteId}`);
  });

  return (
    <section className="editor-layout">
      <div className="page-stack">
        <div className="page-header">
          <div>
            <p className="eyebrow">Question Editor</p>
            <h1>{questionId ? 'question 수정' : 'question 추가'}</h1>
            <p>이미지는 먼저 업로드하고 저장 payload에는 URL과 비율만 보냅니다.</p>
          </div>
        </div>

        {controller.uploadErrorMessage ? (
          <AdminMessage tone="danger">{controller.uploadErrorMessage}</AdminMessage>
        ) : null}
        {controller.saveErrorMessage ? (
          <AdminMessage tone="danger">{controller.saveErrorMessage}</AdminMessage>
        ) : null}

        <form className="form-card" onSubmit={submit}>
          <QuestionForm form={form} />
          <QuestionImagePicker
            icon={<Upload size={18} />}
            isUploading={controller.isUploading}
            onSelect={(file) => void controller.selectImage(file)}
          />
          <div className="form-actions">
            <AdminButton
              onClick={() => navigate(`/votes/${voteId}`)}
              variant="secondary"
            >
              취소
            </AdminButton>
            <AdminButton
              icon={<Save size={18} />}
              isLoading={controller.isSaving}
              type="submit"
            >
              저장
            </AdminButton>
          </div>
        </form>
      </div>

      <QuestionPreviewPanel
        imageRatio={controller.imageRatio}
        imageUrl={controller.previewUrl}
        uploadResult={controller.uploadResult}
      />
    </section>
  );
}
