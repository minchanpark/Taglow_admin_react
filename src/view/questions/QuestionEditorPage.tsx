import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuestionEditorController } from '../../api/controller/useQuestionEditorController';
import { AdminButton } from '../../components/AdminButton';
import { AdminHeader } from '../../components/AdminHeader';
import { AdminMessage } from '../../components/AdminMessage';
import { QuestionForm } from './components/QuestionForm';
import { QuestionImagePicker } from './components/QuestionImagePicker';

type QuestionFormValues = {
  title: string;
  detail: string;
};

export function QuestionEditorPage() {
  const { questionId, voteId = '' } = useParams();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>();
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

  const saveAndFinish = form.handleSubmit(async (values) => {
    await controller.saveQuestion(values);
    navigate(`/admin/category/${voteId}`);
  });

  const saveAndContinue = form.handleSubmit(async (values) => {
    await controller.saveQuestion(values);
    controller.clearSelection();
    form.reset({ title: '', detail: '' });
    setSuccessMessage('항목을 저장했습니다. 다음 항목을 이어서 추가할 수 있습니다.');
  });

  return (
    <section className="admin-screen surface-screen">
      <AdminHeader
        backTo={`/admin/category/${voteId}`}
        title={questionId ? '항목 수정' : '항목 추가'}
      />

      <main className="editor-body">
        <div className="screen-intro">
          <h1>세부 항목 정보를<br />입력해주세요.</h1>
          <p>참여자에게 보일 제목과 포스터 이미지를 준비합니다.</p>
        </div>

        {successMessage ? (
          <AdminMessage tone="success">{successMessage}</AdminMessage>
        ) : null}
        {controller.uploadErrorMessage ? (
          <AdminMessage tone="danger">{controller.uploadErrorMessage}</AdminMessage>
        ) : null}
        {controller.saveErrorMessage ? (
          <AdminMessage tone="danger">{controller.saveErrorMessage}</AdminMessage>
        ) : null}

        <form className="option-form-card" id="option-form" onSubmit={saveAndFinish}>
          <QuestionForm form={form} />
          <QuestionImagePicker
            isUploading={controller.isUploading}
            onSelect={(file) => void controller.selectImage(file)}
            previewUrl={controller.previewUrl}
          />
        </form>
      </main>

      <div className="bottom-cta split">
        {!questionId ? (
          <AdminButton
            form="option-form"
            isLoading={controller.isSaving}
            onClick={saveAndContinue}
            variant="secondary"
          >
            다음 항목 추가
          </AdminButton>
        ) : null}
        <AdminButton
          className="admin-button-black"
          form="option-form"
          isLoading={controller.isSaving}
          type="submit"
          variant="dark"
        >
          완료하기
        </AdminButton>
      </div>
    </section>
  );
}
