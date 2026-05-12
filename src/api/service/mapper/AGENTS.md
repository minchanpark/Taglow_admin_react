# mapper Agent Guide

`src/api/service/mapper`는 server DTO/raw payload와 React domain model 사이의 번역기입니다.

## 책임

- `AuthUserResponse`/raw user payload를 `AdminUser`로 변환합니다.
- vote/question payload를 `AdminVote`, `AdminQuestion`으로 변환합니다.
- domain command를 server request payload로 변환합니다.
- `id`/`userId`, `id`/`voteId`, `name`/`voteName`, `detail`/`description` alias를 흡수합니다.
- `imageRatio` integer scale과 future double schema를 모두 처리합니다.
- update payload에서 null/undefined를 제거합니다.

## 금지

- HTTP 호출, browser API, React state, Zustand, TanStack Query, service provider 접근 금지.
- endpoint path나 credentials 정책을 다루지 않습니다.

## 테스트

Mapper 변경에는 alias, nested payload, enum, imageRatio, null 제거 회귀 테스트를 함께 둡니다.
