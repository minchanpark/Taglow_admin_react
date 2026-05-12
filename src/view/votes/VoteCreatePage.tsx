import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useVoteListController } from '../../api/controller/useVoteListController';
import { AdminButton } from '../common/AdminButton';
import { AdminMessage } from '../common/AdminMessage';
import { AdminTextField } from '../common/AdminTextField';

type CreateVoteForm = {
  name: string;
};

export function VoteCreatePage() {
  const controller = useVoteListController();
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm<CreateVoteForm>();

  const submit = handleSubmit(async (values) => {
    const vote = await controller.createVote(values.name);
    navigate(`/votes/${vote.id}`);
  });

  return (
    <section className="page-stack compact">
      <div className="page-header">
        <div>
          <p className="eyebrow">New Vote</p>
          <h1>새 vote 생성</h1>
          <p>생성 후 상세 화면에서 question 이미지와 운영 링크를 준비합니다.</p>
        </div>
      </div>
      <form className="form-card" onSubmit={submit}>
        <AdminTextField
          label="Vote 이름"
          placeholder="예: 브랜드 팝업 방문객 선호도"
          {...register('name')}
        />
        {controller.createErrorMessage ? (
          <AdminMessage tone="danger">{controller.createErrorMessage}</AdminMessage>
        ) : null}
        <div className="form-actions">
          <AdminButton onClick={() => navigate('/votes')} variant="secondary">
            취소
          </AdminButton>
          <AdminButton
            icon={<Plus size={18} />}
            isLoading={controller.isCreating}
            type="submit"
          >
            생성
          </AdminButton>
        </div>
      </form>
    </section>
  );
}
