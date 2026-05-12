import type {
  QuestionImageSelection,
  QuestionImageUploadResult,
} from '../../model';
import type { QuestionImageUploadService } from './questionImageUploadService';

export class MockQuestionImageUploadService implements QuestionImageUploadService {
  async uploadQuestionImage(
    input: QuestionImageSelection,
  ): Promise<QuestionImageUploadResult> {
    const imageRatio = input.imageWidth / input.imageHeight;
    const safeName = input.fileName.replace(/[^a-zA-Z0-9.-]+/g, '-').toLowerCase();
    const bytes = input.bytes.buffer.slice(
      input.bytes.byteOffset,
      input.bytes.byteOffset + input.bytes.byteLength,
    ) as ArrayBuffer;

    return {
      objectKey: `mock/question-images/${Date.now()}-${safeName}`,
      publicUrl: URL.createObjectURL(
        new Blob([bytes], { type: input.contentType }),
      ),
      contentType: input.contentType,
      sizeBytes: input.bytes.byteLength,
      imageWidth: input.imageWidth,
      imageHeight: input.imageHeight,
      imageRatio,
    };
  }
}
