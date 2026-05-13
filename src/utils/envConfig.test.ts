import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createEnvConfig } from './envConfig';

describe('createEnvConfig', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the dev proxy by default in Vite dev mode', () => {
    vi.stubEnv('VITE_TAGLOW_USE_MOCK_SERVICE', '');
    vi.stubEnv('VITE_TAGLOW_API_BASE_URL', '');
    const env = createEnvConfig();

    expect(env.apiBaseUrl).toBe('');
    expect(env.useMockService).toBe(false);
    expect(env.voteCreatePath).toBe('/api/public/votes');
    expect(env.participantBaseUrl).toContain('taglow-participant');
    expect(env.playerBaseUrl).toContain('taglow-player');
  });

  it('keeps using the dev proxy even if an API URL is configured in dev', () => {
    vi.stubEnv('VITE_TAGLOW_API_BASE_URL', 'https://vote.newdawnsoi.site');
    vi.stubEnv('VITE_TAGLOW_USE_MOCK_SERVICE', 'false');

    expect(createEnvConfig().apiBaseUrl).toBe('');
  });

  it('can force the configured real API URL for remote-api debugging', () => {
    vi.stubEnv('VITE_TAGLOW_API_BASE_URL', 'https://vote.newdawnsoi.site');
    vi.stubEnv('VITE_TAGLOW_FORCE_REMOTE_API', 'true');

    expect(createEnvConfig().apiBaseUrl).toBe('https://vote.newdawnsoi.site');
  });

  it('can opt into the protected vote create endpoint when the server supports it', () => {
    vi.stubEnv('VITE_TAGLOW_VOTE_CREATE_PATH', '/api/votes');

    expect(createEnvConfig().voteCreatePath).toBe('/api/votes');
  });

  it('can opt into the mock service for tests and local demos', () => {
    vi.stubEnv('VITE_TAGLOW_USE_MOCK_SERVICE', 'true');

    expect(createEnvConfig().useMockService).toBe(true);
  });
});
