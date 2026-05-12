# diagnostics View Agent Guide

`src/view/diagnostics`는 운영 진단 화면을 담당합니다.

## 책임

- API base URL, Firebase Hosting origin, participant/player base URL, S3 bucket/region/public base URL 같은 비밀이 아닌 설정을 보여줍니다.
- CORS 실패, 인증 실패, S3 upload 실패, public API 실패를 운영자가 구분할 수 있게 표시합니다.
- public display/questions quick check 결과를 안전한 형태로 보여줍니다.

## 주의

- 비밀번호, session cookie, token, 장기 AWS key, secret key를 표시하지 않습니다.
- raw endpoint/detail을 운영자 문구에 과도하게 노출하지 않습니다.
- quick check는 controller/service를 통해 실행합니다.
