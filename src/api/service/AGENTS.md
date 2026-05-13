# service Agent Guide

`src/api/service`는 API Controller와 Query Hook이 사용하는 side-effect service와 server-facing helper를 둡니다.

## 책임

- `gateway/`는 endpoint, HTTP method, credentials, headers, response normalization, safe error mapping을 담당합니다.
- `mapper/`는 raw payload와 domain model/request payload 사이 변환을 담당합니다.
- upload, QR export, external link launcher, participant share service 같은 side-effect service를 둡니다.

## 주의

- Query Hook과 View에 raw payload를 반환하지 않습니다. public preview처럼 예외가 필요한 경우도 `Record<string, unknown>` 수준으로 안전하게 제한합니다.
- Gateway/Mapper는 `src/api/controller`의 API Controller를 통해 조합합니다.
- React component나 UI copy를 이 계층에 넣지 않습니다.
