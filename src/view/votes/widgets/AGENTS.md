# votes Widgets Agent Guide

`src/view/votes/widgets`는 vote 화면 안에서 재사용되는 작은 UI 조각을 둡니다.

## 책임

- `OperationLinkPanel`, `ParticipantShareSheet`, `VoteStatusControl`, `PublicPreviewPanel`, `QuestionGrid` 같은 widget을 구현합니다.
- props와 callback 중심으로 동작하며, controller hook 호출은 가능한 page 계층에 둡니다.

## 주의

- service, gateway, mapper, generated type import 금지.
- 링크 생성, QR export, player open 같은 side effect를 직접 수행하지 않습니다.
- URL/QR/player action이 비활성화되는 설정 누락 상태를 명확히 표현합니다.
