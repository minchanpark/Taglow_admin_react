import { LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthController } from '../../api/controller/useAuthController';
import { AdminButton } from '../common/AdminButton';
import { AdminMessage } from '../common/AdminMessage';
import { AdminTextField } from '../common/AdminTextField';

type LoginForm = {
  name: string;
  password: string;
};

export function LoginPage() {
  const auth = useAuthController();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/votes';
  const { handleSubmit, register } = useForm<LoginForm>({
    defaultValues: { name: 'operator', password: 'password123' },
  });

  const submit = handleSubmit(async (values) => {
    const success = await auth.login(values);
    if (success) {
      navigate(from, { replace: true });
    }
  });

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <div className="brand-block">
            <div className="brand-mark">T</div>
            <div>
              <strong>Taglow Admin</strong>
              <span>Field operation console</span>
            </div>
          </div>
          <h1>현장 투표 운영을 시작하세요.</h1>
          <p>
            vote 생성, question 이미지 업로드, 참여자 QR과 player 링크 준비를
            한 화면에서 진행합니다.
          </p>
        </div>
        <form className="auth-form" onSubmit={submit}>
          <h2>로그인</h2>
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
          <AdminButton
            icon={<LogIn size={18} />}
            isLoading={auth.isSubmitting}
            type="submit"
          >
            로그인
          </AdminButton>
          <p className="form-link">
            계정이 없나요? <Link to="/signup">회원가입</Link>
          </p>
          <p className="form-hint">
            Mock 계정: <code>operator/password123</code>, 권한 차단 확인:
            <code>guest/password123</code>
          </p>
        </form>
      </section>
    </main>
  );
}
