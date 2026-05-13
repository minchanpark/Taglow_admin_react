# questions View Agent Guide

`src/view/questions`는 question 작성/수정 화면을 담당합니다.

## 책임

- 제목, 설명, 이미지 선택, 업로드 결과, 미리보기, `imageRatio` 표시를 구성합니다.
- `useQuestionEditorQuery`와 React Hook Form을 통해 draft와 save flow를 조율합니다.
- S3 업로드 실패와 API 저장 실패를 구분해 재시도 UX를 제공합니다.

## 주의

- question 저장 payload에는 image bytes를 넣지 않습니다.
- image bytes를 view/store에 장기 보관하지 않습니다.
- upload service나 S3 SDK를 직접 import하지 않습니다.
