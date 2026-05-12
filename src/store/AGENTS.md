# store Agent Guide

`src/store`는 Zustand 기반 client/UI state만 둡니다.

## 책임

- current user cache, sidebar state, toast, transient operation status 같은 작은 전역 상태를 관리합니다.
- server state는 TanStack Query가 소유하고, store는 UI convenience state만 보관합니다.

## 금지

- raw server DTO, API response 원본 저장 금지.
- vote/question list/detail server cache 저장 금지.
- 직접 API 호출, Gateway/Mapper/generated import 금지.

## 주의

- auth session의 최종 진실은 session probe/query와 서버입니다. store는 화면 반응성을 위한 캐시로만 사용합니다.
