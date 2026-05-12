---
name: taglow-debug
description: "Debug Taglow Admin React failures across routing, auth/session, TanStack Query controllers, AdminService, Gateway/Mapper, OpenAPI payloads, CORS/CSRF, S3 upload, QR export, player links, Firebase Hosting, or tests."
---

# Taglow Debugging

## First Pass

Reproduce the symptom and classify it before editing:

- Route/app shell: provider, router, guard, deep link, Firebase rewrite.
- View/controller: form state, disabled state, mutation, query key, invalidation, fallback.
- Service/gateway: endpoint, method, credentials, headers, safe error mapping.
- Mapper: field alias, nested payload, enum, id/date normalization, `imageRatio`.
- Upload/share: S3/CORS, file validation, QR export, clipboard, popup.
- Build/test: TypeScript, Vite, generated types, dependency mismatch.

## Debug Workflow

1. Read the nearest `AGENTS.md` for the touched files.
2. Inspect the smallest layer that can explain the failure.
3. Add or run a focused test before broad refactors when possible.
4. Fix at the owning layer, not at the layer where the symptom appears.
5. Verify the exact regression plus a nearby happy path.

## Common Diagnoses

- Login works but session disappears: check `credentials: 'include'`, Spring CORS allowlist, cookie `SameSite=None; Secure`, and session probe handling.
- View breaks after API response change: fix mapper alias/normalization and add mapper regression test.
- Vote create fails only in production: check `VITE_TAGLOW_VOTE_CREATE_PATH`, temporary public endpoint credential override, CORS/CSRF.
- Upload succeeds but question save fails: keep upload result, inspect mapper question payload, and retry API save.
- QR/player action fails: check missing base URL, browser fallback, and controller callback wiring.

## Safety

Do not log or paste passwords, cookies, tokens, AWS keys, or production secrets. Redact sensitive request/response bodies in notes and tests.
