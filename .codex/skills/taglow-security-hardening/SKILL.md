---
name: taglow-security-hardening
description: "Review and harden Taglow Admin React security. Use for auth/session, route guards, role checks, CORS/CSRF/cookie policy, Vite env exposure, secret handling, S3 upload permissions, QR/player URL safety, logging redaction, and defensive UI behavior."
---

# Taglow Security Hardening

## Threat Model

Treat the React app as an untrusted browser client. Route guards protect UX only; Spring APIs must enforce authorization. Frontend code must avoid leaking secrets and must fail safely.

## Review Checklist

- Auth: unauthenticated users cannot use admin routes; USER and ADMIN are allowed; unsupported roles are blocked.
- Signup: creates normal users only; no ADMIN promotion API or UI.
- Session: credentialed requests use `include`; 401/403 are handled without exposing internals.
- CSRF/CORS: state-changing requests support CSRF/token policy in gateway; Firebase origins are explicit allowlist entries.
- Secrets: no passwords, cookies, tokens, long-lived AWS keys, or private tokens in code, env samples, logs, tests, or diagnostics UI.
- Env: all `VITE_` values are treated as public.
- Upload: S3 access is prefix-limited and temporary, or presigned; content type and size are validated.
- QR/player: no secret or admin URL in QR payload/player URL; participant URL is public.
- Diagnostics: show non-secret config only and use safe messages.
- Logging: redact password payloads and login responses.

## Defensive Implementation

Put security-sensitive behavior at the lowest owning layer:

- Gateway owns credentials, headers, CSRF/token, CORS-friendly request shape, and safe errors.
- Mapper owns payload normalization so raw DTO weirdness does not reach UI.
- Controller owns fallback orchestration and avoids long-lived password/image bytes state.
- View owns clear disabled states and safe operator messages.

## Verification

Add tests for role acceptance/rejection, session probe handling, unsafe import boundaries, upload validation, QR payload, and diagnostics redaction. For external CORS/S3 checks, document the exact origin and request that must be validated.
