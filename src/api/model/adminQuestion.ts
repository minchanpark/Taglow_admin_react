export type AdminQuestion = Readonly<{
  id: string;
  voteId: string;
  title: string;
  detail: string;
  imageUrl: string;
  imageRatio: number;
  createdAt?: string;
  updatedAt?: string;
}>;
