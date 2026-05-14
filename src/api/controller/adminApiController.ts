import type { AdminQuestion, AdminUser, AdminVote, VoteStatus } from '../model';

export interface AdminApiController {
  signup(input: { name: string; password: string }): Promise<AdminUser>;
  login(input: { name: string; password: string }): Promise<AdminUser>;
  fetchCurrentUser(): Promise<AdminUser | null>;
  logout(): Promise<void>;
  deleteCurrentUser(): Promise<void>;

  fetchVotes(): Promise<AdminVote[]>;
  createVote(input: { name: string }): Promise<AdminVote>;
  fetchVote(voteId: string): Promise<AdminVote>;
  updateVote(input: {
    voteId: string;
    name?: string;
    status?: VoteStatus;
  }): Promise<AdminVote>;
  deleteVote(voteId: string): Promise<void>;

  fetchQuestions(voteId: string): Promise<AdminQuestion[]>;
  createQuestion(input: {
    voteId: string;
    title: string;
    detail: string;
    imageUrl: string;
    imageRatio: number;
  }): Promise<AdminQuestion>;
  updateQuestion(input: {
    questionId: string;
    title?: string;
    detail?: string;
    imageUrl?: string;
    imageRatio?: number;
  }): Promise<AdminQuestion>;
  deleteQuestion(questionId: string): Promise<void>;

  fetchPublicVoteDisplay(voteId: string): Promise<Record<string, unknown>>;
  fetchPublicQuestions(voteId: string): Promise<Array<Record<string, unknown>>>;
}
