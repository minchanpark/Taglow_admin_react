# auth View Agent Guide

`src/view/auth`는 로그인과 회원가입 화면을 담당합니다.

## 책임

- `LoginPage`와 `SignupPage` UI를 구현합니다.
- `useAuthController`가 제공하는 상태와 action만 호출합니다.
- USER 또는 ADMIN role만 운영 콘솔 접근 가능하다는 정책을 화면 상태에 반영합니다.

## 주의

- 비밀번호를 장기 React state, Zustand store, log에 남기지 않습니다.
- 회원가입은 `USER` 생성 요청만 다루고 ADMIN 승격 UI/API를 만들지 않습니다.
- auth endpoint나 server DTO를 직접 import하지 않습니다.
