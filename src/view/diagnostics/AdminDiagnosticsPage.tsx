import { CheckCircle2, ShieldCheck, Wifi, XCircle } from 'lucide-react';
import { useAdminRuntime } from '../../api/service/adminRuntime';
import { AdminMessage } from '../common/AdminMessage';

const maskEmpty = (value: string) => (value.trim().length > 0 ? value : 'not configured');

export function AdminDiagnosticsPage() {
  const { env } = useAdminRuntime();

  const checks = [
    {
      label: 'API base URL',
      value: env.apiBaseUrl,
      ok: env.apiBaseUrl.startsWith('http'),
    },
    {
      label: 'Participant base URL',
      value: env.participantBaseUrl,
      ok: env.participantBaseUrl.startsWith('http'),
    },
    {
      label: 'Player base URL',
      value: env.playerBaseUrl,
      ok: env.playerBaseUrl.startsWith('http'),
    },
    {
      label: 'S3 public base URL',
      value: env.s3PublicBaseUrl,
      ok: env.s3PublicBaseUrl.startsWith('http'),
    },
  ];

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Diagnostics</p>
          <h1>운영 환경 진단</h1>
          <p>브라우저 번들에 노출 가능한 설정만 표시합니다.</p>
        </div>
      </div>

      <AdminMessage tone="info">
        Mock MVP에서는 실제 Spring/S3 요청을 실행하지 않습니다. CORS와 session
        cookie는 real API 연결 단계에서 Gateway 진단으로 확장합니다.
      </AdminMessage>

      <div className="diagnostic-grid">
        {checks.map((check) => (
          <article className="diagnostic-card" key={check.label}>
            {check.ok ? <CheckCircle2 /> : <XCircle />}
            <div>
              <span>{check.label}</span>
              <code>{maskEmpty(check.value)}</code>
            </div>
          </article>
        ))}
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Runtime</p>
            <h2>Public configuration</h2>
          </div>
        </div>
        <div className="settings-table">
          <div>
            <span>Mock service</span>
            <strong>{String(env.useMockService)}</strong>
          </div>
          <div>
            <span>Vote create path</span>
            <strong>{env.voteCreatePath}</strong>
          </div>
          <div>
            <span>AWS region</span>
            <strong>{env.awsRegion}</strong>
          </div>
          <div>
            <span>S3 bucket</span>
            <strong>{env.s3Bucket}</strong>
          </div>
          <div>
            <span>S3 image prefix</span>
            <strong>{env.s3QuestionImagePrefix}</strong>
          </div>
          <div>
            <span>Cognito identity pool</span>
            <strong>{maskEmpty(env.cognitoIdentityPoolId)}</strong>
          </div>
        </div>
      </section>

      <div className="diagnostic-notes">
        <div>
          <Wifi size={20} />
          <span>Firebase Hosting origin은 Spring CORS allowlist에 포함되어야 합니다.</span>
        </div>
        <div>
          <ShieldCheck size={20} />
          <span>비밀번호, cookie, token, 장기 AWS key는 diagnostics에 표시하지 않습니다.</span>
        </div>
      </div>
    </section>
  );
}
