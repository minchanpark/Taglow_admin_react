# src Agent Guide

`src`는 React 관리자 앱의 런타임 코드 루트입니다. 구현은 PRD/TDD의 계층 구조를 코드 경계로 표현해야 합니다.

## 구조

```text
app/        App, router, providers, query client
view/       React pages, widgets, shared UI
api/        query hooks, API controllers, domain models, runtime, services, gateway/mapper
utils/      pure utilities and browser helper wrappers
theme/      tokens, colors, typography, global css
store/      Zustand UI/session stores
test/       setup, mocks, fixtures
```

## 공통 규칙

- TypeScript 타입은 domain model을 기준으로 설계합니다.
- 서버 DTO와 endpoint 문자열은 `api/service/gateway`와 `api/service/mapper` 밖으로 새지 않게 합니다.
- UI에서 직접 `fetch`, `window.open`, clipboard, download, S3 SDK를 호출하지 말고 query hook/runtime service/helper를 통합니다.
- React app은 Vite/Firebase Hosting SPA rewrite를 전제로 둡니다.
- 새 디렉터리를 추가하면 해당 디렉터리의 역할과 금지 사항을 담은 `AGENTS.md`도 함께 추가합니다.
