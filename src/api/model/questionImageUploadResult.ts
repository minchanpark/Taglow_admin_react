export type QuestionImageUploadResult = Readonly<{
  objectKey: string;
  publicUrl: string;
  contentType: string;
  sizeBytes: number;
  imageWidth: number;
  imageHeight: number;
  imageRatio: number;
}>;
