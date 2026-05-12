import { describe, expect, it, vi } from 'vitest';
import { createEnvConfig } from './envConfig';

describe('createEnvConfig', () => {
  it('uses the dev proxy by default in Vite dev mode', () => {
    vi.stubEnv('VITE_TAGLOW_USE_MOCK_SERVICE', '');
    const env = createEnvConfig();

    expect(env.apiBaseUrl).toBe('');
    expect(env.useMockService).toBe(false);
    expect(env.voteCreatePath).toBe('/api/votes');
    expect(env.participantBaseUrl).toContain('taglow-participant');
    expect(env.playerBaseUrl).toContain('taglow-player');
  });

  it('uses the configured real API URL when provided', () => {
    vi.stubEnv('VITE_TAGLOW_API_BASE_URL', 'https://vote.newdawnsoi.site');
    vi.stubEnv('VITE_TAGLOW_USE_MOCK_SERVICE', 'false');

    expect(createEnvConfig().apiBaseUrl).toBe('https://vote.newdawnsoi.site');
  });

  it('can opt into the mock service for tests and local demos', () => {
    vi.stubEnv('VITE_TAGLOW_USE_MOCK_SERVICE', 'true');

    expect(createEnvConfig().useMockService).toBe(true);
  });
});
