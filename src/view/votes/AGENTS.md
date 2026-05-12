# votes View Agent Guide

`src/view/votes`는 vote 목록, 생성, 상세 화면과 운영 링크 패널을 담당합니다.

## 책임

- vote 목록의 loading/empty/error/success/retry 상태를 제공합니다.
- vote 생성, 상태 변경, 삭제, question 목록 진입 흐름을 구성합니다.
- participant URL, QR, player URL, public quick check UI는 controller가 제공하는 값과 callback으로만 동작합니다.

## 주의

- 화면은 `AdminVote`, `AdminQuestion`, `AdminVoteLinks` 같은 domain model만 표시합니다.
- participant/player URL을 직접 문자열 조합하지 않습니다.
- QR payload는 participant URL과 동일해야 하며, secret을 포함하지 않습니다.
