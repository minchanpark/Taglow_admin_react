# utils Agent Guide

`src/utils`는 순수 계산과 browser helper wrapper를 둡니다.

## 책임

- `adminUrlBuilder`, `envConfig`, `inputValidator`, `imageRatioReader`, `clipboardHelper`, `browserDownloadHelper` 같은 작은 유틸을 관리합니다.
- participant URL은 `/e/{voteId}`, player URL은 `/display/{voteId}` 정책을 따릅니다.
- clipboard/download/window API는 이곳 또는 service wrapper에서 안전한 fallback을 갖게 합니다.

## 주의

- 서버 API 호출이나 service orchestration을 넣지 않습니다.
- 비밀 값을 env helper에서 만들거나 보관하지 않습니다.
- domain model을 사용할 수는 있지만, view/controller/service 순환 의존을 만들지 않습니다.
