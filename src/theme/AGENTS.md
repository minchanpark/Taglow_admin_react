# theme Agent Guide

`src/theme`은 관리자 콘솔의 design token, color, typography, global CSS를 둡니다.

## 책임

- 운영 도구에 맞는 조용하고 명확한 시각 체계를 제공합니다.
- `tokens.ts`, `colors.ts`, `typography.ts`, `adminTheme.css` 같은 theme foundation을 관리합니다.
- common UI와 page가 재사용할 spacing, focus, state color, table/list density 기준을 둡니다.

## 주의

- API, controller, service, domain business logic을 import하지 않습니다.
- 한 가지 색상 계열만 지배하는 팔레트나 과한 장식성 hero 구성을 피합니다.
- 버튼, 입력, panel, table state가 desktop/tablet 업무 흐름에서 잘 읽히도록 합니다.
