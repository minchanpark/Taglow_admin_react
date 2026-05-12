# controller Agent Guide

`src/api/controller`는 React Controller Hook과 view model을 둡니다. View event를 service use case로 연결하고, TanStack Query mutation/query 상태를 화면 친화적으로 정리합니다.

## 책임

- `useAuthController`, `useVoteListController`, `useVoteDetailController`, `useQuestionEditorController`를 관리합니다.
- TanStack Query cache key, invalidation, mutation composition을 다룹니다.
- upload 성공/API 저장 실패, QR export fallback, player open fallback 같은 workflow를 조율합니다.

## 금지

- Gateway, Mapper, generated type, raw DTO, endpoint string import 금지.
- 직접 `fetch`, S3 SDK, low-level HTTP client 사용 금지.
- browser side effect를 view에서 직접 하도록 넘기지 말고 service/helper callback으로 감쌉니다.

## 주의

- Hook 반환값은 page가 바로 렌더링하기 쉬운 view model이어야 합니다.
- password나 image bytes 같은 민감/대용량 transient data를 장기 보관하지 않습니다.
