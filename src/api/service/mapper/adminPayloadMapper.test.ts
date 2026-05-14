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
          question_count: 2,
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
      questionCount: 2,
    });
  });

  it('normalizes nested question payloads, tag counts, proxy image URLs, and scaled ratios', () => {
    const question = mapper.questionFromPayload(
      {
        tagCount: 8,
        tags: [
          {
            id: 101,
            questionId: 7,
            type: 'TEXT',
            data: '좋아요',
            duration: 4,
            locationX: 0.25,
            locationY: 0.75,
          },
        ],
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
      tagCount: 8,
    });
    expect(question.tags).toEqual([
      expect.objectContaining({
        id: '101',
        questionId: '7',
        type: 'TEXT',
        locationX: 0.25,
        locationY: 0.75,
        data: '좋아요',
        duration: 4,
      }),
    ]);
  });

  it('derives question and tag counts from nested lists when count fields are absent', () => {
    expect(
      mapper.voteFromPayload({
        vote: {
          id: 10,
          name: '현장 투표',
          questions: [{ id: 1 }, { id: 2 }],
        },
      }).questionCount,
    ).toBe(2);

    expect(
      mapper.questionFromPayload({
        data: {
          question: {
            id: 11,
            voteId: 10,
            title: '질문',
            imageRatio: 10000,
          },
          tags: [
            { id: 1, locationX: 10, locationY: 20 },
            { id: 2, locationX: 30, locationY: 40 },
            { id: 3, locationX: 50, locationY: 60 },
          ],
        },
      }).tagCount,
    ).toBe(3);
  });

  it('normalizes tag position aliases from nested question payloads', () => {
    const question = mapper.questionFromPayload({
      question: {
        id: 12,
        voteId: 10,
        title: '질문',
        imageRatio: 10000,
      },
      tags: [
        { tagId: 1, question_id: 12, tag_type: 'photo', x: 15, y: 25 },
        {
          id: 2,
          questionId: 12,
          type: 'VIDEO',
          position: { left: 0.4, top: 0.8 },
        },
        { id: 3, questionId: 12 },
      ],
    });

    expect(question.tags).toEqual([
      expect.objectContaining({
        id: '1',
        questionId: '12',
        type: 'PHOTO',
        locationX: 15,
        locationY: 25,
      }),
      expect.objectContaining({
        id: '2',
        questionId: '12',
        type: 'VIDEO',
        locationX: 0.4,
        locationY: 0.8,
      }),
    ]);
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
