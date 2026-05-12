import type { AdminApiGateway } from './adminApiGateway';
import { AdminApiError, isUnauthorizedStatus } from './adminApiErrors';

type FetchAdminApiGatewayOptions = {
  baseUrl: string;
  voteCreatePath: string;
  credentials?: RequestCredentials;
  fetchImpl?: typeof fetch;
  csrfTokenProvider?: () => string | null;
  timeoutMs?: number;
};

type RequestOptions = {
  body?: Record<string, unknown>;
  credentials?: RequestCredentials;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  sessionProbe?: boolean;
};

const paths = {
  signup: '/api/users',
  login: '/api/auth/login',
  me: '/api/auth/me',
  logout: '/api/auth/logout',
  votes: '/api/votes',
  vote: (voteId: string) => `/api/votes/${encodeURIComponent(voteId)}`,
  voteQuestions: (voteId: string) =>
    `/api/votes/${encodeURIComponent(voteId)}/questions`,
  questions: '/api/questions',
  question: (questionId: string) =>
    `/api/questions/${encodeURIComponent(questionId)}`,
  publicVoteDisplay: (voteId: string) =>
    `/api/public/votes/${encodeURIComponent(voteId)}/display`,
  publicQuestions: (voteId: string) =>
    `/api/public/votes/${encodeURIComponent(voteId)}/questions`,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, '');

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const isPublicVoteCreatePath = (path: string) =>
  normalizePath(path).startsWith('/api/public/');

const extractArray = (payload: unknown): Array<Record<string, unknown>> => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }
  if (!isRecord(payload)) return [];

  const candidates = [
    payload.content,
    payload.data,
    payload.items,
    payload.results,
    payload.votes,
    payload.questions,
    payload.list,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(isRecord);
    }
  }

  if (isRecord(payload.data)) {
    return extractArray(payload.data);
  }

  return [];
};

const extractMessage = (payload: unknown, fallback: string) => {
  if (!isRecord(payload)) return fallback;
  const message = payload.message ?? payload.error ?? payload.detail;
  return typeof message === 'string' && message.trim() ? message : fallback;
};

export class FetchAdminApiGateway implements AdminApiGateway {
  private readonly baseUrl: string;
  private readonly credentials: RequestCredentials;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;
  private readonly voteCreatePath: string;
  private readonly csrfTokenProvider?: () => string | null;

  constructor(options: FetchAdminApiGatewayOptions) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.credentials = options.credentials ?? 'include';
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.voteCreatePath = normalizePath(options.voteCreatePath);
    this.csrfTokenProvider = options.csrfTokenProvider;
  }

  signup(payload: Record<string, unknown>) {
    return this.requestRecord(paths.signup, { method: 'POST', body: payload });
  }

  login(payload: Record<string, unknown>) {
    return this.requestRecord(paths.login, { method: 'POST', body: payload });
  }

  me() {
    return this.requestOptionalRecord(paths.me, { sessionProbe: true });
  }

  async logout() {
    await this.request(paths.logout, { method: 'POST' });
  }

  fetchVotes() {
    return this.requestList(paths.votes);
  }

  createVote(payload: Record<string, unknown>) {
    return this.requestRecord(this.voteCreatePath, {
      method: 'POST',
      body: payload,
      credentials: isPublicVoteCreatePath(this.voteCreatePath) ? 'omit' : undefined,
    });
  }

  fetchVote(voteId: string) {
    return this.requestRecord(paths.vote(voteId));
  }

  updateVote(args: { voteId: string; payload: Record<string, unknown> }) {
    return this.requestRecord(paths.vote(args.voteId), {
      method: 'PATCH',
      body: args.payload,
    });
  }

  async deleteVote(voteId: string) {
    await this.request(paths.vote(voteId), { method: 'DELETE' });
  }

  fetchQuestions(voteId: string) {
    return this.requestList(paths.voteQuestions(voteId));
  }

  createQuestion(payload: Record<string, unknown>) {
    return this.requestRecord(paths.questions, { method: 'POST', body: payload });
  }

  updateQuestion(args: { questionId: string; payload: Record<string, unknown> }) {
    return this.requestRecord(paths.question(args.questionId), {
      method: 'PATCH',
      body: args.payload,
    });
  }

  async deleteQuestion(questionId: string) {
    await this.request(paths.question(questionId), { method: 'DELETE' });
  }

  fetchPublicVoteDisplay(voteId: string) {
    return this.requestRecord(paths.publicVoteDisplay(voteId));
  }

  fetchPublicQuestions(voteId: string) {
    return this.requestList(paths.publicQuestions(voteId));
  }

  private async requestRecord(
    path: string,
    options: RequestOptions = {},
  ): Promise<Record<string, unknown>> {
    const payload = await this.request(path, options);
    if (payload == null) return {};
    if (isRecord(payload)) return payload;
    throw new AdminApiError('서버 응답 형식을 이해할 수 없습니다.', {
      payload,
    });
  }

  private async requestOptionalRecord(
    path: string,
    options: RequestOptions = {},
  ): Promise<Record<string, unknown> | null> {
    const payload = await this.request(path, options);
    if (payload == null) return null;
    if (isRecord(payload)) return payload;
    throw new AdminApiError('서버 응답 형식을 이해할 수 없습니다.', {
      payload,
    });
  }

  private async requestList(
    path: string,
    options: RequestOptions = {},
  ): Promise<Array<Record<string, unknown>>> {
    const payload = await this.request(path, options);
    return extractArray(payload);
  }

  private async request(
    path: string,
    options: RequestOptions = {},
  ): Promise<unknown> {
    const method = options.method ?? 'GET';
    const headers: HeadersInit = {
      Accept: 'application/json',
    };
    const csrfToken = this.csrfTokenProvider?.();

    if (options.body) {
      headers['Content-Type'] = 'application/json';
    }
    if (csrfToken) {
      headers['X-CSRF-TOKEN'] = csrfToken;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), this.timeoutMs);
    let response: Response;
    try {
      response = await this.fetchImpl(`${this.baseUrl}${normalizePath(path)}`, {
        method,
        credentials: options.credentials ?? this.credentials,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new AdminApiError('서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.', {
          payload: error,
        });
      }
      throw new AdminApiError(
        '서버에 연결할 수 없습니다. CORS 또는 네트워크 상태를 확인해주세요.',
        { payload: error },
      );
    } finally {
      window.clearTimeout(timeoutId);
    }

    const payload = await this.parseResponse(response);
    if (response.ok) {
      return payload;
    }

    if (options.sessionProbe && isUnauthorizedStatus(response.status)) {
      return null;
    }

    const fallback =
      response.status === 401 || response.status === 403
        ? '인증이 필요하거나 접근 권한이 없습니다.'
        : '서버 요청에 실패했습니다.';
    throw new AdminApiError(extractMessage(payload, fallback), {
      status: response.status,
      payload,
    });
  }

  private async parseResponse(response: Response): Promise<unknown> {
    if (response.status === 204) return null;

    const text = await response.text();
    if (!text.trim()) return null;

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return { message: text };
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      return { message: text };
    }
  }
}
