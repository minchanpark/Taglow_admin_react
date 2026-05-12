import { describe, expect, it } from 'vitest';
import { createEnvConfig } from './envConfig';

describe('createEnvConfig', () => {
  it('provides safe mock defaults', () => {
    const env = createEnvConfig();

    expect(env.useMockService).toBe(true);
    expect(env.voteCreatePath).toBe('/api/votes');
    expect(env.participantBaseUrl).toContain('taglow-participant');
    expect(env.playerBaseUrl).toContain('taglow-player');
  });
});
