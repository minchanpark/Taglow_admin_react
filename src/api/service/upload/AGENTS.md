# upload Service Agent Guide

`src/api/service/upload`는 question image 선택, dimension 판독, 업로드 구현을 둡니다.

## 책임

- `QuestionImagePickerService`는 file type/size와 image width/height를 검증합니다.
- `QuestionImageUploadService`는 Cognito direct upload 또는 presigned URL PUT 구현을 제공합니다.
- 업로드 결과는 `publicUrl`, `imageRatio`, metadata 중심으로 반환합니다.

## 주의

- 장기 AWS access key, secret key를 frontend에 넣지 않습니다.
- image bytes는 업로드 과정에서만 사용하고 장기 store에 넣지 않습니다.
- S3 실패와 API 저장 실패가 controller에서 구분될 수 있도록 오류 타입/메시지를 안전하게 유지합니다.
