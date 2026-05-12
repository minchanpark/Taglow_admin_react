import { describe, expect, it } from 'vitest';
import { AdminPayloadMapper } from './adminPayloadMapper';

describe('AdminPayloadMapper', () => {
  const mapper = new AdminPayloadMapper();

  it('maps user id aliases and role variants', () => {
    const user = mapper.userFromPayload({
      user: {
        userId: 11,
        username: 'operator',
        authorities: [{ authority: 'ROLE_USER' }, 'ADMIN'],
      },
    });

    expect(user.id).toBe('11');
    expect(user.name).toBe('operator');
    expect(user.roles.has('USER')).toBe(true);
    expect(user.roles.has('ADMIN')).toBe(true);
  });

  it('maps vote aliases to the domain model', () => {
    const vote = mapper.voteFromPayload(
      {
        data: {
          voteId: 31,
          voteName: '현장 투표',
          state: 'CLOSED',
          ownerId: 'user-1',
        },
      },
      { currentUser: { id: 'user-1', name: 'operator', roles: new Set(['USER']) } },
    );

    expect(vote).toMatchObject({
      id: '31',
      name: '현장 투표',
      status: 'END',
      createdByUserId: 'user-1',
      isMine: true,
    });
  });

  it('normalizes nested question payloads, proxy image URLs, and scaled ratios', () => {
    const question = mapper.questionFromPayload(
      {
        question: {
          questionId: 7,
          voteId: 31,
          name: '포토존',
          description: '가장 마음에 드는 포토존',
          imageUrl: 'https://origin.example/image.png',
          imageProxyUrl: 'https://proxy.example/image.png',
          imageRatio: 7353,
        },
      },
      { voteId: 'fallback' },
    );

    expect(question).toMatchObject({
      id: '7',
      voteId: '31',
      title: '포토존',
      detail: '가장 마음에 드는 포토존',
      imageUrl: 'https://proxy.example/image.png',
      imageRatio: 0.7353,
    });
  });

  it('encodes question ratios and removes nil update fields', () => {
    expect(
      mapper.createQuestionToPayload({
        voteId: '42',
        title: '항목',
        detail: '',
        imageUrl: 'https://example.com/image.png',
        imageRatio: 1.23456,
      }),
    ).toMatchObject({
      voteId: 42,
      title: '항목',
      detail: '',
      imageRatio: 12346,
    });

    expect(
      mapper.updateQuestionToPayload({
        title: '새 항목',
        detail: '',
        imageUrl: undefined,
      }),
    ).toEqual({
      title: '새 항목',
      detail: '',
    });
  });
});
