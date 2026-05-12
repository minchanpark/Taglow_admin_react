import type { AdminQuestion, AdminUser, AdminVote } from '../model';
import type { AdminService } from './adminService';
import type { AdminApiGateway } from './gateway/adminApiGateway';
import type { AdminPayloadMapper } from './mapper/adminPayloadMapper';

export class GatewayAdminService implements AdminService {
  private currentUser: AdminUser | null = null;

  constructor(
    private readonly gateway: AdminApiGateway,
    private readonly mapper: AdminPayloadMapper,
  ) {}

  async signup(input: { name: string; password: string }): Promise<AdminUser> {
    const payload = this.mapper.signupToPayload(input);
    const response = await this.gateway.signup(payload);
    return this.mapper.userFromPayload(response, { fallbackName: input.name });
  }

  async login(input: { name: string; password: string }): Promise<AdminUser> {
    const payload = this.mapper.loginToPayload(input);
    const response = await this.gateway.login(payload);
    let user: AdminUser;

    try {
      user = this.mapper.userFromPayload(response, { fallbackName: input.name });
    } catch {
      const me = await this.gateway.me();
      if (!me) throw new Error('로그인 사용자 정보를 확인할 수 없습니다.');
      user = this.mapper.userFromPayload(me, { fallbackName: input.name });
    }
    if (user.roles.size === 0) {
      const me = await this.gateway.me();
      if (me) user = this.mapper.userFromPayload(me, { fallbackName: input.name });
    }

    this.currentUser = user;
    return user;
  }

  async fetchCurrentUser(): Promise<AdminUser | null> {
    const payload = await this.gateway.me();
    this.currentUser = payload ? this.mapper.userFromPayload(payload) : null;
    return this.currentUser;
  }

  async logout(): Promise<void> {
    await this.gateway.logout();
    this.currentUser = null;
  }

  async fetchVotes(): Promise<AdminVote[]> {
    const payloads = await this.gateway.fetchVotes();
    return payloads.map((payload) =>
      this.mapper.voteFromPayload(payload, { currentUser: this.currentUser }),
    );
  }

  async createVote(input: { name: string }): Promise<AdminVote> {
    const response = await this.gateway.createVote(
      this.mapper.createVoteToPayload(input),
    );
    return this.mapper.voteFromPayload(response, { currentUser: this.currentUser });
  }

  async fetchVote(voteId: string): Promise<AdminVote> {
    const response = await this.gateway.fetchVote(voteId);
    return this.mapper.voteFromPayload(response, { currentUser: this.currentUser });
  }

  async updateVote(input: {
    voteId: string;
    name?: string;
    status?: AdminVote['status'];
  }): Promise<AdminVote> {
    const response = await this.gateway.updateVote({
      voteId: input.voteId,
      payload: this.mapper.updateVoteToPayload(input),
    });
    return this.mapper.voteFromPayload(response, { currentUser: this.currentUser });
  }

  deleteVote(voteId: string): Promise<void> {
    return this.gateway.deleteVote(voteId);
  }

  async fetchQuestions(voteId: string): Promise<AdminQuestion[]> {
    const payloads = await this.gateway.fetchQuestions(voteId);
    return payloads.map((payload) =>
      this.mapper.questionFromPayload(payload, { voteId }),
    );
  }

  async createQuestion(input: {
    voteId: string;
    title: string;
    detail: string;
    imageUrl: string;
    imageRatio: number;
  }): Promise<AdminQuestion> {
    const response = await this.gateway.createQuestion(
      this.mapper.createQuestionToPayload(input),
    );
    return this.mapper.questionFromPayload(response, { voteId: input.voteId });
  }

  async updateQuestion(input: {
    questionId: string;
    title?: string;
    detail?: string;
    imageUrl?: string;
    imageRatio?: number;
  }): Promise<AdminQuestion> {
    const response = await this.gateway.updateQuestion({
      questionId: input.questionId,
      payload: this.mapper.updateQuestionToPayload(input),
    });
    return this.mapper.questionFromPayload(response);
  }

  deleteQuestion(questionId: string): Promise<void> {
    return this.gateway.deleteQuestion(questionId);
  }

  fetchPublicVoteDisplay(voteId: string): Promise<Record<string, unknown>> {
    return this.gateway.fetchPublicVoteDisplay(voteId);
  }

  fetchPublicQuestions(voteId: string): Promise<Array<Record<string, unknown>>> {
    return this.gateway.fetchPublicQuestions(voteId);
  }
}
