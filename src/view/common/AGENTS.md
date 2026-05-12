# common View Agent Guide

`src/view/common`은 관리자 콘솔 공통 UI primitive와 shell component를 둡니다.

## 책임

- `AdminShell`, `AdminButton`, `AdminTextField`, `AdminMessage` 같은 재사용 UI를 관리합니다.
- 접근성, focus state, disabled/loading state, validation message 표현을 공통화합니다.

## 주의

- 특정 feature의 business logic을 넣지 않습니다.
- API/service/controller/gateway/generated import를 피합니다.
- 공통 컴포넌트는 theme token을 따르고, feature copy는 page/widget 계층에서 주입합니다.
