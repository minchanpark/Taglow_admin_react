import type { AdminQuestion, AdminUser, AdminVote } from '../model';
import { debugAuthFlow } from '../../utils';
import type { AdminApiController } from './adminApiController';
import type { AdminApiGateway } from '../service/gateway/adminApiGateway';
import type { AdminPayloadMapper } from '../service/mapper/adminPayloadMapper';

export class GatewayAdminApiController implements AdminApiController {
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
    debugAuthFlow('GatewayAdminApiController.login.start', {
      hasName: Boolean(input.name.trim()),
      hasPassword: Boolean(input.password),
    });
    const payload = this.mapper.loginToPayload(input);
    debugAuthFlow('GatewayAdminApiController.login.payloadMapped', {
      payloadKeys: Object.keys(payload),
      containsPassword: Object.hasOwn(payload, 'password'),
    });
    const response = await this.gateway.login(payload);
    debugAuthFlow('GatewayAdminApiController.login.gatewayResponse', {
      responseKeys: Object.keys(response),
    });
    let user: AdminUser;

    try {
      user = this.mapper.userFromPayload(response, { fallbackName: input.name });
      debugAuthFlow('GatewayAdminApiController.login.userMapped', {
        userId: user.id,
        roleCount: user.roles.size,
      });
    } catch {
      debugAuthFlow('GatewayAdminApiController.login.userMapFailed.fetchMe');
      const me = await this.gateway.me();
      if (!me) throw new Error('로그인 사용자 정보를 확인할 수 없습니다.');
      user = this.mapper.userFromPayload(me, { fallbackName: input.name });
      debugAuthFlow('GatewayAdminApiController.login.meMapped', {
        userId: user.id,
        roleCount: user.roles.size,
      });
    }
    if (user.roles.size === 0) {
      debugAuthFlow('GatewayAdminApiController.login.rolesEmpty.fetchMe', {
        userId: user.id,
      });
      const me = await this.gateway.me();
      if (me) user = this.mapper.userFromPayload(me, { fallbackName: input.name });
      debugAuthFlow('GatewayAdminApiController.login.rolesAfterMe', {
        userId: user.id,
        roleCount: user.roles.size,
      });
    }

    this.currentUser = user;
    debugAuthFlow('GatewayAdminApiController.login.done', {
      userId: user.id,
      roleCount: user.roles.size,
    });
    return user;
  }

  async fetchCurrentUser(): Promise<AdminUser | null> {
    debugAuthFlow('GatewayAdminApiController.fetchCurrentUser.start');
    const payload = await this.gateway.me();
    this.currentUser = payload ? this.mapper.userFromPayload(payload) : null;
    debugAuthFlow('GatewayAdminApiController.fetchCurrentUser.done', {
      hasUser: Boolean(this.currentUser),
      roleCount: this.currentUser?.roles.size ?? 0,
    });
    return this.currentUser;
  }

  async logout(): Promise<void> {
    await this.gateway.logout();
    this.currentUser = null;
  }

  async deleteCurrentUser(): Promise<void> {
    const user = this.currentUser ?? (await this.fetchCurrentUser());
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }
    await this.gateway.deleteUser(user.id);
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
