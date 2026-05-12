# model Agent Guide

`src/api/model`은 안정적인 React domain model과 순수 helper를 둡니다.

## 책임

- `AdminUser`, `AdminAuthSession`, `AdminVote`, `AdminQuestion`, `AdminVoteLinks`, upload/QR result 타입을 정의합니다.
- `isAdmin`, `canUseAdminConsole` 같은 domain helper를 순수 함수로 제공합니다.
- 서버 alias나 DTO shape이 아니라 앱 내부 의미를 기준으로 이름을 정합니다.

## 금지

- React, service, controller, view, Zustand, TanStack Query import 금지.
- HTTP, browser API, generated DTO에 의존 금지.
- server field alias 처리는 mapper에 둡니다.
