import type { AdminVoteLinks } from '../api/model';

const trimRightSlash = (value: string) => value.replace(/\/+$/, '');

export class AdminUrlBuilder {
  constructor(
    private readonly participantBaseUrl: string,
    private readonly playerBaseUrl: string,
  ) {}

  buildParticipantUrl(voteId: string): string {
    return `${trimRightSlash(this.participantBaseUrl)}/e/${encodeURIComponent(voteId)}`;
  }

  buildPlayerUrl(voteId: string): string {
    return `${trimRightSlash(this.playerBaseUrl)}/display/${encodeURIComponent(voteId)}`;
  }

  buildPlayerItemUrl(input: { voteId: string; questionId: string }): string {
    return `${this.buildPlayerUrl(input.voteId)}/items/${encodeURIComponent(input.questionId)}`;
  }

  buildVoteLinks(voteId: string): AdminVoteLinks {
    const participantUrl = this.buildParticipantUrl(voteId);
    return {
      voteId,
      participantUrl,
      participantQrPayload: participantUrl,
      playerUrl: this.buildPlayerUrl(voteId),
    };
  }
}
