# view Agent Guide

`src/view`는 React page와 presentational widget 계층입니다. 운영자가 보는 화면과 interaction affordance를 구현하지만 persistence, network, upload 세부사항은 알지 않습니다.

## 책임

- 로그인, vote 목록/상세, question editor, diagnostics 화면을 구성합니다.
- Query hook이 제공하는 view model, domain model, callback을 사용합니다.
- loading, empty, error, retry, disabled, success, fallback state를 빠짐없이 표현합니다.

## 금지

- `api/generated`, `api/service/gateway`, `api/service/mapper` import 금지.
- endpoint string, raw server DTO field name, OpenAPI type 사용 금지.
- 직접 `fetch`, S3 SDK, `window.open`, clipboard, file download side effect 실행 금지.

## UI 기준

- 관리자 도구답게 dense table/list layout과 명확한 작업 버튼을 우선합니다.
- 반복 업무에서 필요한 복사, 다운로드, 새 창 열기, 재시도 동작은 눈에 잘 보여야 합니다.
- in-app 문구에 서버 내부 DTO 이름이나 endpoint를 과도하게 노출하지 않습니다.
