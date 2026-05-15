import { PutObjectCommand } from '@aws-sdk/client-s3';
import { describe, expect, it, vi } from 'vitest';
import { S3QuestionImageUploadService } from './s3QuestionImageUploadService';

describe('S3QuestionImageUploadService', () => {
  it('uploads image bytes with Cognito-backed S3 PutObject', async () => {
    const send = vi.fn(async (_command: PutObjectCommand) => ({}));
    const service = new S3QuestionImageUploadService({
      region: 'ap-northeast-2',
      identityPoolId: 'ap-northeast-2:test-pool',
      bucket: 'bucket',
      publicBaseUrl: 'https://bucket.s3.ap-northeast-2.amazonaws.com/',
      keyPrefix: '/public/question-images/',
      s3Client: { send },
      idProvider: () => 'image-id',
      timestampProvider: () => 1778750000000,
    });

    const result = await service.uploadQuestionImage({
      bytes: new Uint8Array([1, 2, 3]),
      fileName: 'Question Image.png',
      contentType: 'image/png',
      imageWidth: 1200,
      imageHeight: 800,
    });

    expect(result).toMatchObject({
      objectKey: 'public/question-images/1778750000000-image-id-question-image.png',
      publicUrl:
        'https://bucket.s3.ap-northeast-2.amazonaws.com/public/question-images/1778750000000-image-id-question-image.png',
      imageRatio: 1.5,
      sizeBytes: 3,
    });

    expect(send).toHaveBeenCalledTimes(1);
    const command = send.mock.calls[0]?.[0];
    expect(command).toBeInstanceOf(PutObjectCommand);
    expect(command.input).toMatchObject({
      Bucket: 'bucket',
      Key: result.objectKey,
      Body: new Uint8Array([1, 2, 3]),
      CacheControl: 'public, max-age=31536000, immutable',
      ContentType: 'image/png',
    });
  });

  it('keeps S3 upload failures separate from API save failures', async () => {
    const accessDenied = Object.assign(new Error('AccessDenied'), {
      $metadata: { httpStatusCode: 403 },
    });
    const service = new S3QuestionImageUploadService({
      region: 'ap-northeast-2',
      identityPoolId: 'ap-northeast-2:test-pool',
      bucket: 'bucket',
      publicBaseUrl: 'https://bucket.s3.ap-northeast-2.amazonaws.com',
      keyPrefix: 'public/question-images',
      s3Client: { send: vi.fn(async () => Promise.reject(accessDenied)) },
    });

    await expect(
      service.uploadQuestionImage({
        bytes: new Uint8Array([1]),
        fileName: 'question.png',
        contentType: 'image/png',
        imageWidth: 1,
        imageHeight: 1,
      }),
    ).rejects.toThrow('S3 이미지 업로드에 실패했습니다. Cognito 권한과 S3 CORS를 확인해주세요. (403)');
  });

  it('requires a Cognito Identity Pool ID before uploading', async () => {
    const service = new S3QuestionImageUploadService({
      region: 'ap-northeast-2',
      identityPoolId: '',
      bucket: 'bucket',
      publicBaseUrl: 'https://bucket.s3.ap-northeast-2.amazonaws.com',
      keyPrefix: 'public/question-images',
      s3Client: { send: vi.fn(async () => ({})) },
    });

    await expect(
      service.uploadQuestionImage({
        bytes: new Uint8Array([1]),
        fileName: 'question.png',
        contentType: 'image/png',
        imageWidth: 1,
        imageHeight: 1,
      }),
    ).rejects.toThrow('Cognito Identity Pool ID가 설정되지 않았습니다.');
  });
});
