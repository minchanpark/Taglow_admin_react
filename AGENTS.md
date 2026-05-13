# Taglow Admin React Agent Guide

이 문서는 레포 전체에 적용되는 에이전트 지침입니다. 더 가까운 하위 디렉터리에 `AGENTS.md`가 있으면 그 지침을 함께 따르고, 충돌할 때는 더 가까운 지침을 우선합니다.

## 기준 문서

- 제품 요구사항은 `dev/Taglow_admin_React_PRD.md`를 기준으로 합니다.
- 기술 설계는 `dev/Taglow_admin_React_TDD.md`를 기준으로 합니다.
- 문서와 코드가 어긋나면 먼저 문서를 확인하고, 필요한 경우 문서 갱신과 코드 변경을 함께 제안합니다.

## 제품 성격

Taglow Admin React는 마케팅 사이트가 아니라 현장 운영 콘솔입니다. 로그인한 USER 또는 ADMIN이 vote, question image, participant URL, QR, player URL을 빠르게 준비하는 작업 도구여야 합니다.

UI는 desktop/tablet 운영 흐름을 우선합니다. 화면은 밀도 있게 구성하되 상태, 오류, 재시도, 복사/다운로드 fallback을 명확히 보여야 합니다.

## 핵심 아키텍처

서버 API와 React view를 직접 연결하지 않습니다. 모든 구현은 아래 방향을 유지합니다.

```text
view
  -> api/query
  -> api/controller
  -> api/service/gateway + api/service/mapper
  -> api/generated or HTTP client
```

`AdminApiGateway`는 endpoint, HTTP method, credentials, headers, CORS/CSRF, raw response normalization, safe error mapping을 담당합니다.

`AdminPayloadMapper`는 server DTO/raw payload와 React domain model 사이 변환을 담당합니다.

`AdminApiController`는 Query Hook이 호출하는 얇은 domain API 계약입니다. View와 Query Hook은 endpoint 문자열, generated DTO, raw server payload, storage SDK를 직접 알면 안 됩니다.

## 프로젝트 구조

```text
src/
├── app/                  # App composition, router, providers, query client
├── view/                 # React pages and UI widgets
├── api/
│   ├── query/            # React Query hooks and view models
│   ├── controller/       # AdminApiController contract and implementations
│   ├── model/            # Stable domain models
│   ├── runtime/          # Runtime provider and dependency composition
│   ├── service/          # Gateway, mapper, upload/link services
│   └── generated/        # Generated OpenAPI types/clients
├── utils/                # Pure utilities and browser helper wrappers
├── theme/                # Design tokens and global admin theme
├── store/                # Zustand UI/session stores only
└── test/                 # Test setup, mocks, fixtures
```

## 작업 스킬 구조

- Product/Spec: `dev/` 문서를 읽고 요구사항, 오픈 이슈, acceptance criteria를 확인합니다.
- App Shell: `src/app`에서 providers, router, route guard, shell composition을 다룹니다.
- View: `src/view`에서 page/widget UI만 다룹니다. API 세부사항은 import하지 않습니다.
- Query: `src/api/query`에서 TanStack Query mutation/query 조합, form orchestration, view model을 다룹니다.
- API Controller: `src/api/controller`에서 domain API contract와 Gateway/Mapper 조합을 다룹니다.
- Domain/API: `src/api/model`, `src/api/runtime`, `src/api/service`에서 domain model, dependency composition, gateway, mapper, upload, QR, external link 정책을 다룹니다.
- QA: `src/test`와 colocated test에서 mapper/gateway/API controller/query/component/e2e 회귀를 보호합니다.
- Deploy/Infra: Firebase Hosting, Vite env, CORS/S3 설정은 별도 설정 파일이 생기면 해당 하위 지침을 추가합니다.

Repo-local Codex skills live under `.codex/skills`:

- `taglow-implement-feature`: 일반 기능 구현
- `taglow-api-boundary`: AdminApiController, Gateway, Mapper, OpenAPI 경계
- `taglow-ui-workflow`: 운영자용 화면과 공통 UI
- `taglow-upload-share`: question 이미지 업로드, QR, participant/player 링크
- `taglow-debug`: 계층별 디버깅
- `taglow-security-hardening`: 인증, CORS/CSRF, secret, S3, URL 보안 점검
- `taglow-test-suite`: unit/controller/component/e2e 테스트
- `taglow-performance`: 렌더링, 번들, query, 이미지/QR 성능
- `taglow-deploy-diagnostics`: Vite env, Firebase Hosting, public API 진단
- `taglow-review-quality`: 코드 리뷰와 릴리즈 준비 점검

## 의존성 규칙

- `view/**`는 `api/generated`, `api/service/gateway`, `api/service/mapper`, endpoint string, fetch client, S3 SDK를 import하지 않습니다.
- `api/query/**`는 generated type, raw DTO, fetch client, S3 SDK, gateway, mapper를 import하지 않습니다.
- `api/controller/**`는 React Hook, TanStack Query, Zustand, view를 import하지 않습니다.
- `api/model/**`은 service, controller, view, React를 import하지 않습니다.
- `api/service/mapper/**`는 HTTP, React, Zustand, TanStack Query, browser API를 import하지 않습니다.
- `api/service/gateway/**`는 React component, query state, QR/player URL builder를 import하지 않습니다.
- `store/**`에는 raw server DTO나 TanStack Query server state를 저장하지 않습니다.

## 상태 관리

- 서버 데이터는 TanStack Query로 관리합니다.
- 세션 캐시, toast, sidebar, transient UI state는 Zustand로 관리합니다.
- 폼 draft와 validation은 React Hook Form을 기본값으로 둡니다.
- URL route state는 React Router로 관리합니다.
- 순수 계산은 `utils` 또는 `api/model` helper로 분리합니다.

## 보안과 환경

- 비밀번호, session cookie, token, 장기 AWS access key/secret key는 코드, `.env`, 문서 예시에 넣지 않습니다.
- `VITE_` 환경변수는 브라우저에 노출될 수 있다는 전제로 다룹니다.
- question 저장 payload에는 image bytes를 넣지 않습니다. 업로드 후 `imageUrl`, `imageRatio`만 저장합니다.
- QR payload에는 공개 participant URL만 넣습니다.
- player URL에는 secret을 넣지 않습니다.

## 테스트 기준

위험도와 계층 경계에 맞춰 테스트를 둡니다.

- Mapper: field alias, nested payload, enum, `imageRatio` scale/double 호환, null 제거를 검증합니다.
- Gateway: endpoint path, path encoding, credentials, headers, 401/403 session normalization, safe error message를 검증합니다.
- API Controller/Query: role check, mutation invalidation, upload/API failure 분리, copy/download/open fallback을 검증합니다.
- Component: loading/empty/error/success state와 운영자가 실제로 쓰는 workflow를 검증합니다.
- E2E: login, vote/question CRUD, participant URL, QR, player URL, diagnostics deep link를 검증합니다.
