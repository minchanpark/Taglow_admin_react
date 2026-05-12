import type { AdminService } from './adminService';
import type { AdminQuestion, AdminUser, AdminVote, VoteStatus } from '../model';

const nowIso = () => new Date().toISOString();

const cloneUser = (user: AdminUser): AdminUser => ({
  ...user,
  roles: new Set(user.roles),
});

const createUser = (name: string): AdminUser => {
  const normalized = name.trim().toLowerCase();
  const roles =
    normalized === 'guest'
      ? new Set(['VIEWER'])
      : normalized === 'admin'
        ? new Set(['USER', 'ADMIN'])
        : new Set(['USER']);

  return {
    id: normalized === 'operator' ? 'mock-user' : `user-${normalized || 'operator'}`,
    name: name.trim(),
    roles,
  };
};

const sessionStorageKey = 'venturous_session';
const usersStorageKey = 'venturous_users';

const canUseBrowserStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export class MockAdminService implements AdminService {
  private currentUser: AdminUser | null = null;

  private votes: AdminVote[] = [
    {
      id: 'spring-showcase',
      name: '봄 팝업 스토어 현장 투표',
      status: 'PROGRESS',
      createdByUserId: 'mock-user',
      isMine: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: 'standby-demo',
      name: '스탠바이미 시연 후보 선택',
      status: 'END',
      createdByUserId: 'mock-user',
      isMine: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];

  private questions: AdminQuestion[] = [
    {
      id: 'q-best-zone',
      voteId: 'spring-showcase',
      title: '가장 눈길이 가는 포토존은?',
      detail: '현장에서 바로 투표할 대표 이미지를 선택해주세요.',
      imageUrl:
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
      imageRatio: 1.5,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: 'q-next-item',
      voteId: 'spring-showcase',
      title: '다음 굿즈 후보',
      detail: '참여자가 선호하는 굿즈 이미지를 보여줍니다.',
      imageUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      imageRatio: 1.33,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];

  async signup(input: { name: string; password: string }): Promise<AdminUser> {
    this.assertPassword(input.password);
    const user = createUser(input.name);
    if (canUseBrowserStorage()) {
      const storageName = input.name.trim();
      const rawUsers = window.localStorage.getItem(usersStorageKey);
      const users = rawUsers ? (JSON.parse(rawUsers) as Record<string, string>) : {};
      if (users[storageName]) {
        throw new Error('이미 사용 중인 아이디입니다.');
      }
      users[storageName] = input.password;
      window.localStorage.setItem(usersStorageKey, JSON.stringify(users));
    }
    return user;
  }

  async login(input: { name: string; password: string }): Promise<AdminUser> {
    this.assertPassword(input.password);
    const user = createUser(input.name);
    this.currentUser = user;
    if (canUseBrowserStorage()) {
      window.localStorage.setItem(sessionStorageKey, user.name || 'guest');
    }
    return cloneUser(user);
  }

  async fetchCurrentUser(): Promise<AdminUser | null> {
    if (!this.currentUser && canUseBrowserStorage()) {
      const sessionName = window.localStorage.getItem(sessionStorageKey);
      if (sessionName) {
        this.currentUser = createUser(sessionName);
      }
    }
    return this.currentUser ? cloneUser(this.currentUser) : null;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    if (canUseBrowserStorage()) {
      window.localStorage.removeItem(sessionStorageKey);
    }
  }

  async fetchVotes(): Promise<AdminVote[]> {
    return this.votes.map((vote) => this.withOwnership(vote));
  }

  async createVote(input: { name: string }): Promise<AdminVote> {
    const user = this.requireUser();
    const createdAt = nowIso();
    const vote: AdminVote = {
      id: `vote-${Date.now()}`,
      name: input.name.trim(),
      status: 'PROGRESS',
      createdByUserId: user.id,
      isMine: true,
      createdAt,
      updatedAt: createdAt,
    };
    this.votes = [vote, ...this.votes];
    return vote;
  }

  async fetchVote(voteId: string): Promise<AdminVote> {
    return this.withOwnership(this.findVote(voteId));
  }

  async updateVote(input: {
    voteId: string;
    name?: string;
    status?: VoteStatus;
  }): Promise<AdminVote> {
    const current = this.findVote(input.voteId);
    const updated: AdminVote = {
      ...current,
      name: input.name?.trim() || current.name,
      status: input.status ?? current.status,
      updatedAt: nowIso(),
    };
    this.votes = this.votes.map((vote) => (vote.id === updated.id ? updated : vote));
    return this.withOwnership(updated);
  }

  async deleteVote(voteId: string): Promise<void> {
    this.findVote(voteId);
    this.votes = this.votes.filter((vote) => vote.id !== voteId);
    this.questions = this.questions.filter((question) => question.voteId !== voteId);
  }

  async fetchQuestions(voteId: string): Promise<AdminQuestion[]> {
    this.findVote(voteId);
    return this.questions.filter((question) => question.voteId === voteId);
  }

  async createQuestion(input: {
    voteId: string;
    title: string;
    detail: string;
    imageUrl: string;
    imageRatio: number;
  }): Promise<AdminQuestion> {
    this.findVote(input.voteId);
    const createdAt = nowIso();
    const question: AdminQuestion = {
      id: `question-${Date.now()}`,
      voteId: input.voteId,
      title: input.title.trim(),
      detail: input.detail.trim(),
      imageUrl: input.imageUrl,
      imageRatio: input.imageRatio,
      createdAt,
      updatedAt: createdAt,
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
    const current = this.findQuestion(input.questionId);
    const updated: AdminQuestion = {
      ...current,
      title: input.title?.trim() || current.title,
      detail: input.detail === undefined ? current.detail : input.detail.trim(),
      imageUrl: input.imageUrl ?? current.imageUrl,
      imageRatio: input.imageRatio ?? current.imageRatio,
      updatedAt: nowIso(),
    };
    this.questions = this.questions.map((question) =>
      question.id === updated.id ? updated : question,
    );
    return updated;
  }

  async deleteQuestion(questionId: string): Promise<void> {
    this.findQuestion(questionId);
    this.questions = this.questions.filter((question) => question.id !== questionId);
  }

  async fetchPublicVoteDisplay(voteId: string): Promise<Record<string, unknown>> {
    const vote = this.findVote(voteId);
    return {
      id: vote.id,
      voteName: vote.name,
      status: vote.status,
      questionCount: this.questions.filter((question) => question.voteId === voteId).length,
    };
  }

  async fetchPublicQuestions(voteId: string): Promise<Array<Record<string, unknown>>> {
    return (await this.fetchQuestions(voteId)).map((question) => ({
      id: question.id,
      title: question.title,
      description: question.detail,
      imageUrl: question.imageUrl,
      imageRatio: question.imageRatio,
    }));
  }

  private assertPassword(password: string) {
    if (password.length < 4) {
      throw new Error('비밀번호는 4자 이상 입력해주세요.');
    }
  }

  private requireUser(): AdminUser {
    if (!this.currentUser) {
      throw new Error('로그인이 필요합니다.');
    }
    return this.currentUser;
  }

  private findVote(voteId: string): AdminVote {
    const vote = this.votes.find((item) => item.id === voteId);
    if (!vote) {
      throw new Error('해당 vote를 찾을 수 없습니다.');
    }
    return vote;
  }

  private findQuestion(questionId: string): AdminQuestion {
    const question = this.questions.find((item) => item.id === questionId);
    if (!question) {
      throw new Error('해당 question을 찾을 수 없습니다.');
    }
    return question;
  }

  private withOwnership(vote: AdminVote): AdminVote {
    return {
      ...vote,
      isMine: this.currentUser?.id === vote.createdByUserId,
    };
  }
}
