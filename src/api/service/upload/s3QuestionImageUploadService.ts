import type {
  QuestionImageSelection,
  QuestionImageUploadResult,
} from '../../model';
import type { QuestionImageUploadService } from './questionImageUploadService';

type S3QuestionImageUploadServiceOptions = {
  publicBaseUrl: string;
  keyPrefix: string;
  fetchImpl?: typeof fetch;
  idProvider?: () => string;
  timestampProvider?: () => number;
};

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

const normalizePrefix = (value: string) =>
  value
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
    .join('/');

const encodeObjectKey = (objectKey: string) =>
  objectKey.split('/').map(encodeURIComponent).join('/');

const sanitizeFileName = (fileName: string) =>
  fileName.replace(/[^a-zA-Z0-9.-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() ||
  'question-image';

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export class S3QuestionImageUploadService implements QuestionImageUploadService {
  private readonly publicBaseUrl: string;
  private readonly keyPrefix: string;
  private readonly fetchImpl: typeof fetch;
  private readonly idProvider: () => string;
  private readonly timestampProvider: () => number;

  constructor(options: S3QuestionImageUploadServiceOptions) {
    this.publicBaseUrl = normalizeBaseUrl(options.publicBaseUrl);
    this.keyPrefix = normalizePrefix(options.keyPrefix);
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
    this.idProvider = options.idProvider ?? createId;
    this.timestampProvider = options.timestampProvider ?? Date.now;
  }

  async uploadQuestionImage(
    input: QuestionImageSelection,
  ): Promise<QuestionImageUploadResult> {
    if (!this.publicBaseUrl) {
      throw new Error('S3 public base URL이 설정되지 않았습니다.');
    }

    const imageRatio = input.imageWidth / input.imageHeight;
    const objectKey = [this.keyPrefix, this.createObjectName(input.fileName)]
      .filter(Boolean)
      .join('/');
    const publicUrl = `${this.publicBaseUrl}/${encodeObjectKey(objectKey)}`;
    const bytes = input.bytes.buffer.slice(
      input.bytes.byteOffset,
      input.bytes.byteOffset + input.bytes.byteLength,
    ) as ArrayBuffer;

    let response: Response;
    try {
      response = await this.fetchImpl(publicUrl, {
        method: 'PUT',
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Content-Type': input.contentType,
        },
        body: bytes,
      });
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `S3 이미지 업로드에 실패했습니다. ${error.message}`
          : 'S3 이미지 업로드에 실패했습니다.',
      );
    }

    if (!response.ok) {
      throw new Error(
        `S3 이미지 업로드에 실패했습니다. CORS와 업로드 권한을 확인해주세요. (${response.status})`,
      );
    }

    return {
      objectKey,
      publicUrl,
      contentType: input.contentType,
      sizeBytes: input.bytes.byteLength,
      imageWidth: input.imageWidth,
      imageHeight: input.imageHeight,
      imageRatio,
    };
  }

  private createObjectName(fileName: string) {
    return `${this.timestampProvider()}-${this.idProvider()}-${sanitizeFileName(fileName)}`;
  }
}
