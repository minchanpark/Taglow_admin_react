# mocks Agent Guide

`src/test/mocks`는 테스트용 mock data, fake service, MSW handler를 둡니다.

## 책임

- domain fixture와 raw server payload fixture를 구분해 보관합니다.
- USER/ADMIN role 허용, unsupported role 차단, upload success/failure, API failure를 재현할 수 있게 합니다.
- MockAdminApiController와 테스트 double은 production `AdminApiController` contract를 따릅니다.

## 주의

- 실제 비밀번호, token, cookie, AWS key를 fixture에 넣지 않습니다.
- mock payload가 Mapper 회귀 목적이 아니라면 server DTO shape을 view 테스트에 노출하지 않습니다.
