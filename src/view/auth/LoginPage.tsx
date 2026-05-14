import { LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthQuery } from '../../api/query/useAuthQuery';
import taglowLogo from '../../assets/logo/taglow_logo.png';
import { AdminButton } from '../../components/AdminButton';
import { AdminMessage } from '../../components/AdminMessage';
import { AdminTextField } from '../../components/AdminTextField';
import { debugAuthFlow } from '../../utils';
import './css/LoginPage.css';

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
    defaultValues: { name: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    debugAuthFlow('LoginPage.submit.valid', {
      hasName: Boolean(values.name.trim()),
      hasPassword: Boolean(values.password),
      redirectTo: from,
    });
    const success = await auth.login(values);
    debugAuthFlow('LoginPage.submit.result', { success, redirectTo: from });
    if (success) {
      debugAuthFlow('LoginPage.navigate', { to: from });
      navigate(from, { replace: true });
    }
  }, (errors) => {
    debugAuthFlow('LoginPage.submit.invalid', {
      fields: Object.keys(errors),
    });
  });

  return (
    <section className="auth-screen">
      <div className="auth-body">
        <div className="auth-logo-showcase">
          <img src={taglowLogo} alt="Taglow logo" />
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

        </form>
      </div>
      <div className="bottom-cta">
        <AdminButton
          fullWidth
          icon={<LogIn size={20} />}
          isLoading={auth.isSubmitting}
          onClick={() =>
            debugAuthFlow('LoginPage.button.click', {
              form: 'login-form',
              isSubmitting: auth.isSubmitting,
            })
          }
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
