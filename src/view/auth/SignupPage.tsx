import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthController } from '../../api/controller/useAuthController';
import { AdminButton } from '../common/AdminButton';
import { AdminMessage } from '../common/AdminMessage';
import { AdminTextField } from '../common/AdminTextField';

type SignupForm = {
  name: string;
  password: string;
  passwordConfirm: string;
};

export function SignupPage() {
  const auth = useAuthController();
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm<SignupForm>();

  const submit = handleSubmit(async (values) => {
    const success = await auth.signup(values);
    if (success) {
      navigate('/login', { replace: true });
    }
  });

  return (
    <main className="auth-page">
      <section className="auth-panel narrow">
        <form className="auth-form" onSubmit={submit}>
          <h1>회원가입</h1>
          <p>신규 사용자는 서버 정책에 따라 USER role로 생성됩니다.</p>
          <AdminTextField label="계정명" autoComplete="username" {...register('name')} />
          <AdminTextField
            label="비밀번호"
            type="password"
            autoComplete="new-password"
            {...register('password')}
          />
          <AdminTextField
            label="비밀번호 확인"
            type="password"
            autoComplete="new-password"
            {...register('passwordConfirm')}
          />
          {auth.errorMessage ? (
            <AdminMessage tone="danger">{auth.errorMessage}</AdminMessage>
          ) : null}
          <AdminButton
            icon={<UserPlus size={18} />}
            isLoading={auth.isSubmitting}
            type="submit"
          >
            USER 계정 생성
          </AdminButton>
          <p className="form-link">
            이미 계정이 있나요? <Link to="/login">로그인</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
