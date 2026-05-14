# runtime Agent Guide

`src/api/runtime`은 React Context 기반 dependency composition 계층입니다. env, API Controller, URL/clipboard/QR/upload/link 서비스를 한곳에서 조립해 Query Hook에 제공합니다.

## 책임

- `AdminRuntimeProvider`, `useAdminRuntime`, `useAdminApiController`를 관리합니다.
- API Controller 생성은 provider factory에 위임하며 production runtime은 실 서버 Gateway 구현체만 사용합니다.
- browser side-effect service 인스턴스를 생성하고 Query Hook에 contract로 노출합니다.

## 금지

- React page/component UI를 import하지 않습니다.
- server raw payload, endpoint string, generated DTO를 직접 다루지 않습니다.
- TanStack Query cache key나 mutation invalidation 정책을 넣지 않습니다.
