# app Agent Guide

`src/app`은 앱 조립 계층입니다. 화면별 제품 로직이 아니라 router, providers, query client, runtime provider wiring, app shell composition을 둡니다.

## 책임

- `App.tsx`, `router.tsx`, `providers.tsx`, `queryClient.ts` 같은 앱 진입 구성을 관리합니다.
- route guard는 auth query hook과 domain contract를 통해 구성합니다.
- TanStack Query, React Router, Zustand provider, AdminRuntime provider를 한곳에서 연결합니다.

## 주의

- vote/question CRUD, upload, QR export 같은 feature logic을 이곳에 넣지 않습니다.
- endpoint 문자열이나 generated DTO를 직접 다루지 않습니다.
- 페이지 UI는 `view/**`에 두고, 이곳에서는 라우팅과 provider 조립만 합니다.
