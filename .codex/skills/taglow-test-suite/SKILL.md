---
name: taglow-test-suite
description: "Design, add, run, or repair Taglow Admin tests. Use for Vitest unit tests, React Testing Library component tests, controller hook tests, MSW/fake service fixtures, Playwright e2e tests, mapper/gateway regressions, and acceptance coverage."
---

# Taglow Test Suite

## Test Pyramid

Prefer the smallest test that protects the behavior:

- Mapper unit tests for DTO compatibility and request payload shaping.
- Gateway unit tests for HTTP details and safe error behavior.
- Utility tests for URL/env/validation/image ratio helpers.
- Controller hook tests for query/mutation orchestration and fallbacks.
- Component tests for rendered states and user actions.
- Playwright e2e for critical flows and deployment deep links.

## Required Regressions

Mapper:

- `id`/`userId`, `id`/`voteId`, `id`/`questionId` aliases.
- `name`/`voteName`, `detail`/`description` aliases.
- Nested `{ question, tags }` payloads.
- `imageRatio` scaled integer decode and future double decode.
- Null/undefined removal in create/update payloads.

Gateway:

- Endpoint path and path segment encoding.
- No `Content-Type` on bodyless GET.
- JSON `Content-Type` on body-bearing POST/PATCH.
- Default credentials and temporary public vote create override.
- Session probe 401/403 -> `null`.
- Login failures -> safe messages.

Controllers/components:

- USER/ADMIN allowed, unsupported role blocked.
- Vote create invalidates list.
- Upload success/API failure split.
- Participant/player copy, QR export fallback, popup fallback.
- Diagnostics states.

## E2E Acceptance Flow

Cover login, vote list, create vote, add question, copy participant URL, QR preview, player URL generation, public API quick check, and deep link refresh for `/login`, `/votes`, `/votes/:voteId`, and `/diagnostics`.

## Fixtures

Keep raw server payload fixtures limited to mapper/gateway tests. Use domain fixtures or fake `AdminService` for view/controller tests.
