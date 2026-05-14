---
name: taglow-sync-server-api
description: "Inspect live Taglow server API changes at https://vote.newdawnsoi.site and update the React admin API boundary, gateway, mapper, models, query hooks, mocks, and tests safely."
---

# Taglow Sync Server API

## Purpose

Use this skill when the Spring server API at `https://vote.newdawnsoi.site` has changed, may have changed, or needs to be verified before updating Taglow Admin React. This skill complements `taglow-api-boundary`: discover the live server contract first, then absorb changes behind Gateway/Mapper/domain contracts so View and Query code stay stable.

## Start Here

1. Also load `taglow-api-boundary` for boundary rules.
2. Read the nearest guides for the files being changed, usually:
   - `src/api/AGENTS.md`
   - `src/api/service/AGENTS.md`
   - `src/api/service/gateway/AGENTS.md`
   - `src/api/service/mapper/AGENTS.md`
   - `src/api/query/AGENTS.md` if query cache behavior changes
3. Identify the exact user-facing problem or server change before editing.

## Discover Server Contract

Use the live server as the source of truth, not memory.

- Base URL: `https://vote.newdawnsoi.site`
- Prefer official schema endpoints if available: `/v3/api-docs`, `/swagger-ui`, `/openapi.json`, `/api-docs`.
- For known endpoints, capture status, headers, and trimmed JSON samples with `curl -sS -D -`.
- If an endpoint requires login/session cookies, do not ask for or print secrets. Reproduce through the local dev proxy/browser session when possible, or state the auth blocker and inspect available code/tests.
- Keep sample payloads minimal. Redact passwords, tokens, cookies, and private user data.

Useful probes:

```bash
curl -sS -D - https://vote.newdawnsoi.site/api/votes
curl -sS -D - https://vote.newdawnsoi.site/api/votes/{voteId}
curl -sS -D - https://vote.newdawnsoi.site/api/votes/{voteId}/questions
curl -sS -D - https://vote.newdawnsoi.site/api/public/votes/{voteId}/display
curl -sS -D - https://vote.newdawnsoi.site/api/public/votes/{voteId}/questions
```

## Map The Change

Classify the server change before patching:

- Endpoint path/method/credentials/header changed: update `FetchAdminApiGateway` and gateway tests.
- Response shape/field alias/nesting changed: update `AdminPayloadMapper` and mapper tests.
- Request payload changed: update mapper request methods, then controller/gateway tests if needed.
- App meaning changed, such as `questionCount` or `tagCount`: update `api/model`, mapper, mock controller, query/view usage, and tests.
- Query freshness changed after mutation: update invalidation in `src/api/query/**`.

Do not let `view/**` or `api/query/**` import endpoint strings, raw DTOs, generated types, gateway, mapper, or server payload shapes.

## Common Taglow Changes

- `GET /api/votes` returning `questionCount`: add/maintain `AdminVote.questionCount`; map aliases like `questionCount`, `questionsCount`, or `question_count`.
- `GET /api/votes/{voteId}/questions` returning `tagCount`: add/maintain `AdminQuestion.tagCount`; if only `tags` is returned, derive `tagCount` from `tags.length` in the mapper.
- Nested question payloads such as `{ question, tags }`: keep unwrapping in `AdminPayloadMapper`; do not expose this nesting to views.
- Public display payloads are for participant/player verification. Do not replace admin source-of-truth endpoints with public endpoints unless the user explicitly chooses that architecture.
- `imageRatio` may be returned as scaled integer or future double. Domain model must keep the real numeric ratio.

## Patch Order

1. Gateway: endpoint paths, methods, credentials, headers, safe error mapping.
2. Mapper: response aliases/nesting, request shaping, null removal, `imageRatio` compatibility.
3. Model/controller/mock: stable domain fields and local mock parity.
4. Query hooks: cache keys, invalidation after create/update/delete, retry/refetch behavior.
5. View: only consume stable domain fields; keep display-only edits small.
6. Tests: cover every compatibility rule that motivated the change.

## Verification

Run the smallest meaningful checks first, then broaden if the change touches shared contracts.

```bash
pnpm test
pnpm typecheck
pnpm build
```

For focused work, prefer targeted Vitest runs around mapper/gateway/controller/query tests before full validation.

## Done When

- Live server behavior has been checked or the auth/network blocker is clearly documented.
- Gateway owns endpoint/HTTP concerns.
- Mapper owns DTO compatibility and payload normalization.
- Domain models changed only for real app meaning.
- Views and query hooks remain free of raw server details.
- Mock controller and tests reflect the new contract.
- The final response names the server endpoints checked, files changed, and verification run.
