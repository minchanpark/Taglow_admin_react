# auth/components Agent Guide

`src/view/auth/components`는 로그인/회원가입 화면에서만 쓰는 브랜드 블록과 보조 UI를 둡니다.

## Guardrails
- 인증 화면 공통 셸, 버튼, 입력은 `src/components`를 사용합니다.
- 프로토타입 인증은 `venturous_session`, `venturous_users` localStorage 정책을 따르고 비밀번호를 화면에 노출하지 않습니다.
