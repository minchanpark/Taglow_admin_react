---
name: taglow-review-quality
description: "Review Taglow Admin React changes for quality and release readiness. Use for code review, import-boundary checks, architecture drift, missing tests, PR readiness, regression risk, acceptance criteria, and final implementation audits."
---

# Taglow Review Quality

## Review Stance

Lead with bugs, regressions, security risks, and missing tests. Tie findings to concrete files and lines when reviewing code.

## Architecture Checklist

- View imports only controller/domain/common UI, not gateway, mapper, generated API, endpoints, fetch clients, or storage SDKs.
- Controller imports `AdminService` contracts and helpers, not gateway/mapper/generated/raw DTOs.
- Mapper owns DTO aliases and `imageRatio` compatibility.
- Gateway owns endpoint, method, credentials, headers, CSRF/token, response normalization, and safe errors.
- Zustand stores UI/session convenience state only, not server DTOs or vote/question cache.
- Question save payload excludes image bytes.

## Product Checklist

- USER and ADMIN can use the console; unsupported roles are blocked.
- Signup does not create/promote ADMIN.
- Vote/question CRUD uses domain models.
- Participant URL, QR payload, and player URL match PRD policy.
- Public API quick check is available where required.
- Diagnostics exposes non-secret config only.

## Test Checklist

- Mapper/gateway changes include unit regressions.
- Controller changes include hook tests for query/mutation/fallback behavior.
- View changes include component tests for loading/empty/error/success states.
- Critical workflow changes include or preserve e2e coverage.
- Security-sensitive changes test role handling, redaction, or upload validation.

## Release Readiness

Before calling work complete, run available typecheck, lint, tests, and build. If any command is missing or blocked, state that clearly and identify the residual risk.
