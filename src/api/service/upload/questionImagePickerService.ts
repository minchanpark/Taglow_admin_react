import type { QuestionImageSelection } from '../../model';
import { readImageDimensions } from '../../../utils';

export interface QuestionImagePickerService {
  pickQuestionImage(file: File): Promise<QuestionImageSelection>;
}

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export class BrowserQuestionImagePickerService implements QuestionImagePickerService {
  constructor(private readonly maxSizeBytes = 10 * 1024 * 1024) {}

  async pickQuestionImage(file: File): Promise<QuestionImageSelection> {
    if (!allowedTypes.has(file.type)) {
      throw new Error('지원하지 않는 이미지 형식입니다.');
    }
    if (file.size > this.maxSizeBytes) {
      throw new Error('이미지 용량이 너무 큽니다.');
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const { width, height } = await readImageDimensions(file);
    return {
      bytes,
      fileName: file.name,
      contentType: file.type,
      imageWidth: width,
      imageHeight: height,
    };
  }
}
