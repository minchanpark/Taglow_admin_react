import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import type {
  QuestionImageSelection,
  QuestionImageUploadResult,
} from '../../model';
import type { QuestionImageUploadService } from './questionImageUploadService';

type S3UploadClient = Pick<S3Client, 'send'>;

type S3QuestionImageUploadServiceOptions = {
  region: string;
  identityPoolId: string;
  bucket: string;
  publicBaseUrl: string;
  keyPrefix: string;
  s3Client?: S3UploadClient;
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
  private readonly region: string;
  private readonly identityPoolId: string;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;
  private readonly keyPrefix: string;
  private readonly s3Client?: S3UploadClient;
  private readonly idProvider: () => string;
  private readonly timestampProvider: () => number;

  constructor(options: S3QuestionImageUploadServiceOptions) {
    this.region = options.region.trim();
    this.identityPoolId = options.identityPoolId.trim();
    this.bucket = options.bucket.trim();
    this.publicBaseUrl = normalizeBaseUrl(options.publicBaseUrl);
    this.keyPrefix = normalizePrefix(options.keyPrefix);
    this.s3Client = options.s3Client;
    this.idProvider = options.idProvider ?? createId;
    this.timestampProvider = options.timestampProvider ?? Date.now;
  }

  async uploadQuestionImage(
    input: QuestionImageSelection,
  ): Promise<QuestionImageUploadResult> {
    if (!this.publicBaseUrl) {
      throw new Error('S3 public base URL이 설정되지 않았습니다.');
    }
    if (!this.region) {
      throw new Error('AWS region이 설정되지 않았습니다.');
    }
    if (!this.identityPoolId) {
      throw new Error('Cognito Identity Pool ID가 설정되지 않았습니다.');
    }
    if (!this.bucket) {
      throw new Error('S3 bucket이 설정되지 않았습니다.');
    }

    const imageRatio = input.imageWidth / input.imageHeight;
    const objectKey = [this.keyPrefix, this.createObjectName(input.fileName)]
      .filter(Boolean)
      .join('/');
    const publicUrl = `${this.publicBaseUrl}/${encodeObjectKey(objectKey)}`;
    const s3Client = this.s3Client ?? this.createS3Client();

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: objectKey,
          Body: input.bytes,
          CacheControl: 'public, max-age=31536000, immutable',
          ContentType: input.contentType,
        }),
      );
    } catch (error) {
      const statusCode = getAwsStatusCode(error);
      throw new Error(
        `S3 이미지 업로드에 실패했습니다. Cognito 권한과 S3 CORS를 확인해주세요.${
          statusCode ? ` (${statusCode})` : ''
        }`,
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

  private createS3Client() {
    return new S3Client({
      region: this.region,
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: this.region },
        identityPoolId: this.identityPoolId,
      }),
    });
  }
}

const getAwsStatusCode = (error: unknown) => {
  if (typeof error !== 'object' || error == null || !('$metadata' in error)) {
    return null;
  }

  const metadata = (error as { $metadata?: { httpStatusCode?: number } }).$metadata;
  return typeof metadata?.httpStatusCode === 'number' ? metadata.httpStatusCode : null;
};
