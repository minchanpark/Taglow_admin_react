import { describe, expect, it } from 'vitest';
import { AdminUrlBuilder } from './adminUrlBuilder';

describe('AdminUrlBuilder', () => {
  it('builds participant and player URLs with encoded vote ids', () => {
    const builder = new AdminUrlBuilder(
      'https://taglow-participant.web.app/',
      'https://taglow-player.web.app/',
    );

    const links = builder.buildVoteLinks('vote 1');

    expect(links.participantUrl).toBe(
      'https://taglow-participant.web.app/e/vote%201',
    );
    expect(links.participantQrPayload).toBe(links.participantUrl);
    expect(links.playerUrl).toBe(
      'https://taglow-player.web.app/display/vote%201',
    );
  });
});
