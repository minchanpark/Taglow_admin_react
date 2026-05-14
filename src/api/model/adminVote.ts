export type VoteStatus = 'PROGRESS' | 'END';

export type AdminVote = Readonly<{
  id: string;
  name: string;
  status: VoteStatus;
  createdByUserId: string;
  isMine: boolean;
  questionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}>;
