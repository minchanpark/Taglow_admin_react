import { UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthQuery } from '../../api/query/useAuthQuery';
import { AdminButton } from '../../components/AdminButton';
import { AdminHeader } from '../../components/AdminHeader';
import { AdminMessage } from '../../components/AdminMessage';
import { AdminTextField } from '../../components/AdminTextField';
import './css/SignupPage.css';

type SignupForm = {
  name: string;
  password: string;
  passwordConfirm: string;
};

export function SignupPage() {
  const auth = useAuthQuery();
  const navigate = useNavigate();
  const { handleSubmit, register } = useForm<SignupForm>();

  const submit = handleSubmit(async (values) => {
    const success = await auth.signup(values);
    if (success) {
      navigate('/login', { replace: true });
    }
  });

  return (
    <section className="auth-screen">
      <AdminHeader title="회원가입" titleTone="black" />
      <div className="auth-body auth-body-with-header">
        <div className="auth-title-block">
          <h1>환영합니다.</h1>
          <p>계정을 만들어 시작해보세요.</p>
        </div>
        <form className="auth-form" id="signup-form" onSubmit={submit}>
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
        </form>
      </div>
      <div className="bottom-cta">
        <AdminButton
          fullWidth
          icon={<UserPlus size={20} />}
          isLoading={auth.isSubmitting}
          type="submit"
          form="signup-form"
        >
          가입하기
        </AdminButton>
        <p className="bottom-link">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </section>
  );
}
