export const queryKeys = {
  currentUser: ['currentUser'] as const,
  votes: ['votes'] as const,
  vote: (voteId: string) => ['vote', voteId] as const,
  questions: (voteId: string) => ['questions', voteId] as const,
  publicPreview: (voteId: string) => ['publicPreview', voteId] as const,
};
