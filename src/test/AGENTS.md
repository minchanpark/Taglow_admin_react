# test Agent Guide

`src/test`는 테스트 setup, mocks, fixtures, helper를 둡니다.

## 책임

- Vitest, React Testing Library, MSW, Playwright가 공유하는 setup을 관리합니다.
- mapper/gateway/controller/component/e2e 테스트가 재사용할 helper와 fixture를 둡니다.
- mock service는 real `AdminService` contract와 같은 표면을 가져야 합니다.

## 주의

- 테스트 편의를 위해 계층 위반을 production code에 요구하지 않습니다.
- raw payload fixture는 mapper/gateway 테스트에 한정하고, view/controller 테스트는 domain-facing fixture를 우선합니다.
- 실패와 fallback 시나리오를 정상 흐름만큼 중요하게 다룹니다.
