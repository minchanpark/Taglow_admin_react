# api Agent Guide

`src/api`는 React view와 서버/API 사이의 domain boundary입니다. 이 계층은 서버 DTO 변화가 화면으로 번지지 않게 막는 핵심 방어선입니다.

## 구조

```text
query/       React Query hooks and view models
controller/  AdminApiController contract and gateway implementation
model/       Stable React domain model
runtime/     Runtime dependency composition and provider
service/     Side-effect services, gateway, mapper, upload/link helpers
generated/   OpenAPI generated types/clients
```

## 규칙

- `api/model`의 domain model은 Query Hook, API Controller, View가 공유하는 안정 계약입니다.
- `api/query`는 `AdminApiController` 계약만 호출합니다.
- `api/controller`는 Gateway와 Mapper를 조합해 domain model을 반환합니다.
- generated type은 Gateway/Mapper/Service 내부 보조 타입으로만 사용합니다.
- `api/**`에서 `view/**`를 import하지 않습니다.
