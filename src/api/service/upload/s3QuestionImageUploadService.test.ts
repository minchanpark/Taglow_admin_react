import { describe, expect, it, vi } from 'vitest';
import { S3QuestionImageUploadService } from './s3QuestionImageUploadService';

describe('S3QuestionImageUploadService', () => {
  it('uploads image bytes to the configured S3 public URL', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 200 }));
    const service = new S3QuestionImageUploadService({
      publicBaseUrl: 'https://bucket.s3.ap-northeast-2.amazonaws.com/',
      keyPrefix: '/public/question-images/',
      fetchImpl: fetchImpl as unknown as typeof fetch,
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
    expect(fetchImpl).toHaveBeenCalledWith(
      result.publicUrl,
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({ 'Content-Type': 'image/png' }),
      }),
    );
  });

  it('keeps S3 upload failures separate from API save failures', async () => {
    const service = new S3QuestionImageUploadService({
      publicBaseUrl: 'https://bucket.s3.ap-northeast-2.amazonaws.com',
      keyPrefix: 'public/question-images',
      fetchImpl: vi.fn(async () => new Response(null, { status: 403 })) as unknown as typeof fetch,
    });

    await expect(
      service.uploadQuestionImage({
        bytes: new Uint8Array([1]),
        fileName: 'question.png',
        contentType: 'image/png',
        imageWidth: 1,
        imageHeight: 1,
      }),
    ).rejects.toThrow('S3 이미지 업로드에 실패했습니다.');
  });
});
