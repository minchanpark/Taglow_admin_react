import { describe, expect, it } from 'vitest';
import { canUseAdminConsole } from '../model';
import { MockAdminService } from './mockAdminService';

describe('MockAdminService', () => {
  it('logs in USER operators and blocks unsupported role through helper', async () => {
    const service = new MockAdminService();

    const operator = await service.login({
      name: 'operator',
      password: 'password123',
    });
    expect(canUseAdminConsole(operator)).toBe(true);

    const guest = await service.login({ name: 'guest', password: 'password123' });
    expect(canUseAdminConsole(guest)).toBe(false);
  });

  it('creates votes and questions without image bytes in question payload', async () => {
    const service = new MockAdminService();
    await service.login({ name: 'operator', password: 'password123' });

    const vote = await service.createVote({ name: '테스트 vote' });
    const question = await service.createQuestion({
      voteId: vote.id,
      title: '질문',
      detail: '설명',
      imageUrl: 'https://example.com/question.png',
      imageRatio: 1.5,
    });

    expect(question.voteId).toBe(vote.id);
    expect(question.imageUrl).toBe('https://example.com/question.png');
    expect(question.imageRatio).toBe(1.5);
    await expect(service.fetchPublicQuestions(vote.id)).resolves.toHaveLength(1);
  });
});
