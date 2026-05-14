export type AdminQuestionTagType = 'TEXT' | 'PHOTO' | 'VIDEO' | 'UNKNOWN';

export type AdminQuestionTag = Readonly<{
  id: string;
  questionId: string;
  type: AdminQuestionTagType;
  locationX: number;
  locationY: number;
  data?: string;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
}>;

export type AdminQuestion = Readonly<{
  id: string;
  voteId: string;
  title: string;
  detail: string;
  imageUrl: string;
  imageRatio: number;
  tagCount?: number;
  tags?: readonly AdminQuestionTag[];
  createdAt?: string;
  updatedAt?: string;
}>;
