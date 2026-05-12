export type QuestionImageSelection = Readonly<{
  bytes: Uint8Array;
  fileName: string;
  contentType: string;
  imageWidth: number;
  imageHeight: number;
}>;
