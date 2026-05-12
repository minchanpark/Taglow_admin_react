import type { QuestionImageSelection, QuestionImageUploadResult } from '../../model';

export interface QuestionImageUploadService {
  uploadQuestionImage(
    input: QuestionImageSelection,
  ): Promise<QuestionImageUploadResult>;
}
