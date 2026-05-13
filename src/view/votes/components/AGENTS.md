# votes/components Agent Guide

`src/view/votes/components`는 vote/category 화면 안에서만 쓰는 작은 UI 조각을 둡니다.

## 책임

- `QuestionGrid`, `VoteStatusControl`, `TagSticker` 같은 화면 전용 컴포넌트를 구현합니다.
- props와 callback 중심으로 동작하며, query hook 호출은 가능한 page 계층에 둡니다.

## 주의

- service, gateway, mapper, generated type import 금지.
- 링크 생성, QR export, player open 같은 side effect를 직접 수행하지 않습니다.
- URL/QR/player action이 필요하면 page controller에서 받은 callback만 호출합니다.
