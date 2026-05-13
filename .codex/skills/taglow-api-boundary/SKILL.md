---
name: taglow-api-boundary
description: "Maintain Taglow Admin API integration boundaries. Use when creating or changing AdminApiController, MockAdminApiController, GatewayAdminApiController, AdminApiGateway, FetchAdminApiGateway, AdminPayloadMapper, OpenAPI generated types, endpoint paths, DTO compatibility, or server payload normalization."
---

# Taglow API Boundary

## Purpose

Keep server DTOs and endpoint details behind `AdminApiGateway` and `AdminPayloadMapper` so React views and query hooks stay stable when the Spring API changes.

## Workflow

1. Read `src/api/AGENTS.md`, `src/api/service/AGENTS.md`, and the nearest gateway/mapper/model guide.
2. Start from the `AdminApiController` contract expected by query hooks.
3. Update domain models only when the app meaning changes, not because a server field changed.
4. Put endpoint, method, credentials, CSRF/token, response normalization, and safe error mapping in gateway.
5. Put field aliases, enum normalization, date/id normalization, request payload shaping, and `imageRatio` compatibility in mapper.
6. Keep generated OpenAPI types inside gateway/mapper/service internals.
7. Add mapper and gateway tests for every compatibility rule.

## Gateway Rules

- Default browser credentials to `include`.
- Add JSON `Content-Type` only for requests with a JSON body.
- Encode path segments with `encodeURIComponent`.
- Normalize 401/403 session probes to `null`; map login failures to safe user-facing messages.
- Redact password payloads and login responses from logs.
- Keep temporary `/api/public/votes` vote creation isolated behind config.

## Mapper Rules

- Accept `id`/`userId`, `id`/`voteId`, `id`/`questionId`, `name`/`voteName`, `detail`/`description`.
- Accept nested question payloads such as `{ question, tags }`.
- Domain `imageRatio` is always the real numeric ratio.
- While the backend uses integer schema, encode ratio as `Math.round(value * 10000)` and decode large values by dividing by `10000`.
- Remove null and undefined values from partial update payloads.

## Done When

No view/query hook import references generated DTOs, endpoint strings, raw payload shapes, gateway, or mapper. Mapper/gateway tests cover the DTO variation or endpoint behavior that motivated the change.
