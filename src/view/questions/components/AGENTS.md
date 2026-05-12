# questions/components Agent Guide

`src/view/questions/components`는 question editor의 form, image picker UI를 둡니다.

## 책임

- `QuestionForm`, `QuestionImagePicker` 같은 presentational component를 구현합니다.
- file input의 선택 결과는 controller에 전달하고, 업로드 orchestration은 controller/service가 맡습니다.

## 주의

- 이미지 dimension 계산이나 upload policy가 복잡해지면 `utils` 또는 `api/service/upload`로 분리합니다.
- server DTO, endpoint, S3 credential, generated type을 직접 다루지 않습니다.
- 미리보기 URL을 만들었다면 lifecycle에 맞춰 정리합니다.
