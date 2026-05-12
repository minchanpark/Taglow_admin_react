# generated API Agent Guide

`src/api/generated`는 OpenAPI 기반 생성물을 둡니다.

## 규칙

- 이 디렉터리의 생성 파일은 직접 수정하지 않습니다.
- OpenAPI를 갱신한 뒤 생성 명령으로 재생성합니다.
- generated type/client는 Gateway, Mapper, Service 내부에서만 import합니다.
- View와 Controller는 generated type을 직접 import하지 않습니다.

## 주의

- OpenAPI snapshot이 실제 payload와 다를 수 있습니다. 차이는 Mapper runtime test와 normalization으로 흡수합니다.
- generated type 이름이나 server schema 이름을 UI copy에 노출하지 않습니다.
