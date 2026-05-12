# service Agent Guide

`src/api/service`는 Controller가 호출하는 use case 계약과 구현체를 둡니다.

## 책임

- `AdminService` contract, `MockAdminService`, `OpenApiAdminService`, service provider를 관리합니다.
- `OpenApiAdminService`는 Gateway와 Mapper를 조합해 domain model만 반환합니다.
- upload, QR export, external link launcher, participant share service 같은 side-effect service를 둡니다.

## 주의

- Controller와 View에 raw payload를 반환하지 않습니다. public preview처럼 예외가 필요한 경우도 `Record<string, unknown>` 수준으로 안전하게 제한합니다.
- 구현체가 mock인지 real인지 Controller가 알 필요 없게 contract를 유지합니다.
- React component나 UI copy를 이 계층에 넣지 않습니다.
