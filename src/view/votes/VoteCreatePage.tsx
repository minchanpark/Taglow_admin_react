import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useVoteListQuery } from '../../api/query/useVoteListQuery';
import { AdminButton } from '../../components/AdminButton';
import { AdminHeader } from '../../components/AdminHeader';
import { AdminMessage } from '../../components/AdminMessage';
import { AdminTextField } from '../../components/AdminTextField';
import './css/VoteCreatePage.css';

type CreateVoteForm = {
  name: string;
};

export function VoteCreatePage() {
  const voteList = useVoteListQuery();
  const navigate = useNavigate();
  const form = useForm<CreateVoteForm>({ defaultValues: { name: '' } });
  const name = form.watch('name');

  const submit = form.handleSubmit(async (values) => {
    const vote = await voteList.createVote(values.name);
    navigate(`/admin/category/${vote.id}`);
  });

  return (
    <section className="admin-screen">
      <AdminHeader backTo="/admin" title="새 카테고리 생성" titleTone="black" />

      <form className="create-screen-body" id="create-category-form" onSubmit={submit}>
        <div className="screen-intro">
          <h1>어떤 투표를<br />만드시겠어요?</h1>
        </div>
        <AdminTextField
          label="투표 제목"
          placeholder="예: 벤쳐러스 방명록"
          {...form.register('name')}
        />
        {voteList.createErrorMessage ? (
          <AdminMessage tone="danger">{voteList.createErrorMessage}</AdminMessage>
        ) : null}
      </form>

      <div className="bottom-cta">
        <AdminButton
          disabled={!name.trim()}
          fullWidth
          form="create-category-form"
          isLoading={voteList.isCreating}
          type="submit"
        >
          다음 단계로
        </AdminButton>
      </div>
    </section>
  );
}
