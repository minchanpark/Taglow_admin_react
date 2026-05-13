import { describe, expect, it } from 'vitest';
import { canUseAdminConsole } from '../model';
import { MockAdminApiController } from './mockAdminApiController';

describe('MockAdminApiController', () => {
  it('logs in USER operators and blocks unsupported role through helper', async () => {
    const apiController = new MockAdminApiController();

    const operator = await apiController.login({
      name: 'operator',
      password: 'password123',
    });
    expect(canUseAdminConsole(operator)).toBe(true);

    const guest = await apiController.login({
      name: 'guest',
      password: 'password123',
    });
    expect(canUseAdminConsole(guest)).toBe(false);
  });

  it('creates votes and questions without image bytes in question payload', async () => {
    const apiController = new MockAdminApiController();
    await apiController.login({ name: 'operator', password: 'password123' });

    const vote = await apiController.createVote({ name: '테스트 vote' });
    const question = await apiController.createQuestion({
      voteId: vote.id,
      title: '질문',
      detail: '설명',
      imageUrl: 'https://example.com/question.png',
      imageRatio: 1.5,
    });

    expect(question.voteId).toBe(vote.id);
    expect(question.imageUrl).toBe('https://example.com/question.png');
    expect(question.imageRatio).toBe(1.5);
    await expect(apiController.fetchPublicQuestions(vote.id)).resolves.toHaveLength(1);
  });
});
