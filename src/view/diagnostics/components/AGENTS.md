# diagnostics/components Agent Guide

`src/view/diagnostics/components`는 설정 화면 안에서만 쓰는 모달, 섹션, 행 컴포넌트를 둡니다.

## Guardrails
- 공통 버튼, 헤더, 입력은 `src/components`에서 가져옵니다.
- 설정 화면의 destructive action은 확인 모달을 거치고, 비밀값이나 token을 표시하지 않습니다.
