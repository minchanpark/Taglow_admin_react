import { describe, expect, it, vi } from 'vitest';
import { FetchAdminApiGateway } from './fetchAdminApiGateway';

const jsonResponse = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
    status: 200,
    ...init,
  });

describe('FetchAdminApiGateway', () => {
  it('uses configured endpoints and does not send Content-Type on bodyless GET', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ content: [] }));
    const gateway = new FetchAdminApiGateway({
      baseUrl: 'https://vote.newdawnsoi.site/',
      voteCreatePath: '/api/votes',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await gateway.fetchVotes();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://vote.newdawnsoi.site/api/votes',
      expect.objectContaining({ method: 'GET', credentials: 'include' }),
    );
    const init = (fetchMock.mock.calls as unknown as Array<[string, RequestInit]>)[0][1];
    expect(init.headers).toEqual({ Accept: 'application/json' });
  });

  it('encodes path segments and sends JSON Content-Type for PATCH bodies', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ id: 'a/b', name: '수정' }));
    const gateway = new FetchAdminApiGateway({
      baseUrl: 'https://vote.newdawnsoi.site',
      voteCreatePath: '/api/votes',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await gateway.updateVote({
      voteId: 'a/b',
      payload: { name: '수정' },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://vote.newdawnsoi.site/api/votes/a%2Fb',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ name: '수정' }),
      }),
    );
    const init = (fetchMock.mock.calls as unknown as Array<[string, RequestInit]>)[0][1];
    expect(init.headers).toEqual({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  });

  it('omits credentials for temporary public vote create endpoints', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ id: 1, name: '공개 생성' }));
    const gateway = new FetchAdminApiGateway({
      baseUrl: 'https://vote.newdawnsoi.site',
      voteCreatePath: '/api/public/votes',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await gateway.createVote({ name: '공개 생성' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://vote.newdawnsoi.site/api/public/votes',
      expect.objectContaining({ credentials: 'omit' }),
    );
  });

  it('normalizes session probe 401/403 responses to null', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({}, { status: 403 }));
    const gateway = new FetchAdminApiGateway({
      baseUrl: 'https://vote.newdawnsoi.site',
      voteCreatePath: '/api/votes',
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(gateway.me()).resolves.toBeNull();
  });
});
