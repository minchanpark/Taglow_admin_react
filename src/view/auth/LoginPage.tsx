import { LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthQuery } from '../../api/query/useAuthQuery';
import { AdminButton } from '../../components/AdminButton';
import { AdminMessage } from '../../components/AdminMessage';
import { AdminTextField } from '../../components/AdminTextField';
import { AuthBrand } from './components/AuthBrand';

type LoginForm = {
  name: string;
  password: string;
};

export function LoginPage() {
  const auth = useAuthQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';
  const { handleSubmit, register } = useForm<LoginForm>({
    defaultValues: auth.isMockService
      ? { name: 'operator', password: 'password123' }
      : { name: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    const success = await auth.login(values);
    if (success) {
      navigate(from, { replace: true });
    }
  });

  return (
    <section className="auth-screen">
      <div className="auth-body">
        <AuthBrand />
        <div className="auth-title-block">
          <h1>태그로 남기는<br />우리의 순간.</h1>
          <p>관리자 계정으로 로그인해 투표를 만들고 QR로 공유하세요.</p>
        </div>
        <form className="auth-form" id="login-form" onSubmit={submit}>
          <AdminTextField label="계정명" autoComplete="username" {...register('name')} />
          <AdminTextField
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {auth.errorMessage ? (
            <AdminMessage tone="danger">{auth.errorMessage}</AdminMessage>
          ) : null}
          {auth.successMessage ? (
            <AdminMessage tone="success">{auth.successMessage}</AdminMessage>
          ) : null}
          {auth.isMockService ? (
            <p className="form-hint">
              Mock 계정: <code>operator/password123</code>, 권한 차단 확인:
              <code>guest/password123</code>
            </p>
          ) : (
            <p className="form-hint">실 서버에 등록된 관리자 계정으로 로그인해주세요.</p>
          )}
        </form>
      </div>
      <div className="bottom-cta">
        <AdminButton
          fullWidth
          icon={<LogIn size={20} />}
          isLoading={auth.isSubmitting}
          type="submit"
          form="login-form"
        >
          로그인
        </AdminButton>
        <p className="bottom-link">
          계정이 없나요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </section>
  );
}
