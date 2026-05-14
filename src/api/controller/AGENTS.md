# controller Agent Guide

`src/api/controller`는 React Query hook이 호출하는 얇은 API Controller 계층입니다. Gateway와 Mapper를 조합해 server raw payload를 app domain model로 변환합니다.

## 책임

- `AdminApiController` contract, `GatewayAdminApiController`, provider를 관리합니다.
- Gateway 호출 전 domain command를 Mapper로 server payload로 변환합니다.
- Gateway raw response를 Mapper로 domain model로 변환합니다.
- production runtime은 실 서버 Gateway 구현체만 사용합니다.

## 금지

- React Hook, Zustand, TanStack Query 사용 금지.
- endpoint string, raw DTO field alias 판단을 직접 구현하지 않습니다.
- 직접 `fetch`, S3 SDK, browser UI side effect 사용 금지.

## 주의

- API Controller는 domain model만 반환합니다.
- public preview처럼 예외가 필요한 경우도 `Record<string, unknown>` 수준으로 제한합니다.
- field alias, enum, `imageRatio` 호환성은 Mapper에 둡니다.
