# gateway Agent Guide

`src/api/service/gateway`는 low-level server adapter 계층입니다.

## 책임

- API base URL, endpoint path, method, path/query encoding을 관리합니다.
- `credentials: 'include'`, CSRF/token header, JSON `Content-Type` 정책을 적용합니다.
- raw response body를 object/list payload로 정규화합니다.
- 401/403/session probe, CORS/network, server error를 safe `AdminApiError`로 매핑합니다.
- password payload와 login response는 debug log에서 redaction합니다.

## 금지

- domain model 생성 금지.
- React Hook, Zustand, TanStack Query 사용 금지.
- QR/player URL 생성 금지.
- 화면 문구나 validation 정책 결정 금지.
