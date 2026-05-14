import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import type { AdminQuestion, AdminUser, AdminVote, VoteStatus } from '../api/model';
import type { AdminApiController } from '../api/controller/adminApiController';
import { AdminRuntimeProvider, type AdminRuntime } from '../api/runtime/adminRuntime';
import { AdminUrlBuilder, type EnvConfig } from '../utils';

const testEnv: EnvConfig = {
  apiBaseUrl: 'https://vote.newdawnsoi.site',
  participantBaseUrl: 'https://taglow-participant.web.app',
  playerBaseUrl: 'https://taglow-player.web.app',
  voteCreatePath: '/api/public/votes',
  awsRegion: 'ap-northeast-2',
  cognitoIdentityPoolId: '',
  s3Bucket: 'tagvote-content-bucket',
  s3PublicBaseUrl: 'https://tagvote-content-bucket.s3.ap-northeast-2.amazonaws.com',
  s3QuestionImagePrefix: 'public/question-images',
};

const cloneUser = (user: AdminUser): AdminUser => ({
  ...user,
  roles: new Set(user.roles),
});

class TestAdminApiController implements AdminApiController {
  private currentUser: AdminUser | null = null;

  private votes: AdminVote[] = [
    {
      id: 'test-vote',
      name: '현장 테스트 투표',
      status: 'PROGRESS',
      createdByUserId: 'operator',
      isMine: true,
      questionCount: 1,
      createdAt: '2026-05-14T00:00:00.000Z',
    },
  ];

  private questions: AdminQuestion[] = [
    {
      id: 'test-question',
      voteId: 'test-vote',
      title: '테스트 항목',
      detail: '테스트 설명',
      imageUrl: 'https://example.com/question.png',
      imageRatio: 1.5,
      tagCount: 3,
    },
  ];

  async signup(input: { name: string; password: string }): Promise<AdminUser> {
    return this.createUser(input.name);
  }

  async login(input: { name: string; password: string }): Promise<AdminUser> {
    this.currentUser = this.createUser(input.name);
    return cloneUser(this.currentUser);
  }

  async fetchCurrentUser(): Promise<AdminUser | null> {
    return this.currentUser ? cloneUser(this.currentUser) : null;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  async deleteCurrentUser(): Promise<void> {
    this.currentUser = null;
  }

  async fetchVotes(): Promise<AdminVote[]> {
    return this.votes.map((vote) => ({
      ...vote,
      questionCount: this.questions.filter((question) => question.voteId === vote.id)
        .length,
    }));
  }

  async createVote(input: { name: string }): Promise<AdminVote> {
    const vote: AdminVote = {
      id: `vote-${this.votes.length + 1}`,
      name: input.name,
      status: 'PROGRESS',
      createdByUserId: this.currentUser?.id ?? 'operator',
      isMine: true,
      questionCount: 0,
    };
    this.votes = [vote, ...this.votes];
    return vote;
  }

  async fetchVote(voteId: string): Promise<AdminVote> {
    const vote = this.votes.find((item) => item.id === voteId);
    if (!vote) throw new Error('해당 vote를 찾을 수 없습니다.');
    return vote;
  }

  async updateVote(input: {
    voteId: string;
    name?: string;
    status?: VoteStatus;
  }): Promise<AdminVote> {
    const current = await this.fetchVote(input.voteId);
    const updated = {
      ...current,
      name: input.name ?? current.name,
      status: input.status ?? current.status,
    };
    this.votes = this.votes.map((vote) => (vote.id === updated.id ? updated : vote));
    return updated;
  }

  async deleteVote(voteId: string): Promise<void> {
    this.votes = this.votes.filter((vote) => vote.id !== voteId);
    this.questions = this.questions.filter((question) => question.voteId !== voteId);
  }

  async fetchQuestions(voteId: string): Promise<AdminQuestion[]> {
    return this.questions.filter((question) => question.voteId === voteId);
  }

  async createQuestion(input: {
    voteId: string;
    title: string;
    detail: string;
    imageUrl: string;
    imageRatio: number;
  }): Promise<AdminQuestion> {
    const question: AdminQuestion = {
      id: `question-${this.questions.length + 1}`,
      voteId: input.voteId,
      title: input.title,
      detail: input.detail,
      imageUrl: input.imageUrl,
      imageRatio: input.imageRatio,
      tagCount: 0,
    };
    this.questions = [question, ...this.questions];
    return question;
  }

  async updateQuestion(input: {
    questionId: string;
    title?: string;
    detail?: string;
    imageUrl?: string;
    imageRatio?: number;
  }): Promise<AdminQuestion> {
    const current = this.questions.find((question) => question.id === input.questionId);
    if (!current) throw new Error('해당 question을 찾을 수 없습니다.');
    const updated = {
      ...current,
      title: input.title ?? current.title,
      detail: input.detail ?? current.detail,
      imageUrl: input.imageUrl ?? current.imageUrl,
      imageRatio: input.imageRatio ?? current.imageRatio,
    };
    this.questions = this.questions.map((question) =>
      question.id === updated.id ? updated : question,
    );
    return updated;
  }

  async deleteQuestion(questionId: string): Promise<void> {
    this.questions = this.questions.filter((question) => question.id !== questionId);
  }

  async fetchPublicVoteDisplay(voteId: string): Promise<Record<string, unknown>> {
    const vote = await this.fetchVote(voteId);
    return { id: vote.id, voteName: vote.name, status: vote.status };
  }

  async fetchPublicQuestions(voteId: string): Promise<Array<Record<string, unknown>>> {
    return this.questions.filter((question) => question.voteId === voteId);
  }

  private createUser(name: string): AdminUser {
    return {
      id: name.trim() || 'operator',
      name: name.trim() || 'operator',
      roles: new Set(name.trim() === 'guest' ? ['VIEWER'] : ['USER']),
    };
  }
}

const createTestRuntime = (): AdminRuntime => ({
  env: testEnv,
  adminApiController: new TestAdminApiController(),
  urlBuilder: new AdminUrlBuilder(testEnv.participantBaseUrl, testEnv.playerBaseUrl),
  clipboard: { copyText: async () => undefined },
  qrExportService: {
    downloadParticipantQr: async ({ voteId }) => ({
      fileName: `taglow-${voteId}-participant-qr.svg`,
      format: 'svg',
      byteLength: 0,
    }),
  },
  externalLinkLauncher: { openNewTab: async () => undefined },
  imagePickerService: {
    pickQuestionImage: async () => {
      throw new Error('이미지 선택 테스트 서비스가 설정되지 않았습니다.');
    },
  },
  imageUploadService: {
    uploadQuestionImage: async (input) => ({
      objectKey: `test/${input.fileName}`,
      publicUrl: `https://example.com/${input.fileName}`,
      contentType: input.contentType,
      sizeBytes: input.bytes.byteLength,
      imageWidth: input.imageWidth,
      imageHeight: input.imageHeight,
      imageRatio: input.imageWidth / input.imageHeight,
    }),
  },
});

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions & { route?: string; runtime?: AdminRuntime },
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const runtime = options?.runtime ?? createTestRuntime();

  return render(
    <QueryClientProvider client={queryClient}>
      <AdminRuntimeProvider runtime={runtime}>
        <MemoryRouter initialEntries={[options?.route ?? '/']}>{ui}</MemoryRouter>
      </AdminRuntimeProvider>
    </QueryClientProvider>,
    options,
  );
}
