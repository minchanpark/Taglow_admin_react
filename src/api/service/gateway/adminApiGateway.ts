export interface AdminApiGateway {
  signup(payload: Record<string, unknown>): Promise<Record<string, unknown>>;
  login(payload: Record<string, unknown>): Promise<Record<string, unknown>>;
  me(): Promise<Record<string, unknown> | null>;
  logout(): Promise<void>;

  fetchVotes(): Promise<Array<Record<string, unknown>>>;
  createVote(payload: Record<string, unknown>): Promise<Record<string, unknown>>;
  fetchVote(voteId: string): Promise<Record<string, unknown>>;
  updateVote(args: {
    voteId: string;
    payload: Record<string, unknown>;
  }): Promise<Record<string, unknown>>;
  deleteVote(voteId: string): Promise<void>;

  fetchQuestions(voteId: string): Promise<Array<Record<string, unknown>>>;
  createQuestion(payload: Record<string, unknown>): Promise<Record<string, unknown>>;
  updateQuestion(args: {
    questionId: string;
    payload: Record<string, unknown>;
  }): Promise<Record<string, unknown>>;
  deleteQuestion(questionId: string): Promise<void>;

  fetchPublicVoteDisplay(voteId: string): Promise<Record<string, unknown>>;
  fetchPublicQuestions(voteId: string): Promise<Array<Record<string, unknown>>>;
}
