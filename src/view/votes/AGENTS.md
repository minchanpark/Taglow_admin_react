# votes View Agent Guide

`src/view/votes`는 `/admin` 카테고리 목록, 생성, 세부 항목 관리, 스티커 상세, 공유 화면을 담당합니다.

## 책임

- category 목록의 loading/empty/error 상태를 제공합니다.
- category 생성, 상태 변경, 삭제, 세부 항목 진입 흐름을 구성합니다.
- participant URL, QR, player URL UI는 controller가 제공하는 값과 callback으로만 동작합니다.

## 주의

- 화면은 `AdminVote`, `AdminQuestion`, `AdminVoteLinks` 같은 domain model만 표시합니다.
- participant/player URL을 직접 문자열 조합하지 않고 `AdminUrlBuilder` 결과를 사용합니다.
- QR payload는 participant URL과 동일해야 하며, secret을 포함하지 않습니다.
