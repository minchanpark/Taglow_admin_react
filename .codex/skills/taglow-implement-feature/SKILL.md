---
name: taglow-implement-feature
description: "Implement Taglow Admin React features from the PRD/TDD. Use when adding or changing auth, vote, question, diagnostics, routing, providers, Zustand/TanStack Query controllers, or feature slices while preserving the layered view-controller-service-gateway-mapper architecture."
---

# Taglow Feature Implementation

## Quick Start

Read the nearest `AGENTS.md`, then inspect `dev/Taglow_admin_React_PRD.md` and `dev/Taglow_admin_React_TDD.md` for the requested feature. Confirm which layer owns the work before editing.

Implement from stable contracts outward:

1. Domain model in `src/api/model` if the app meaning changes.
2. Service contract or implementation in `src/api/service` if a use case changes.
3. Controller hook in `src/api/controller` for query/mutation orchestration.
4. View page/widget in `src/view` for rendering and user interaction.
5. App wiring in `src/app` only for providers, routes, guards, or shell setup.
6. Tests at the lowest useful layer, then component or e2e coverage for workflow risk.

## Non-Negotiable Boundaries

- Do not import `api/generated`, gateway, mapper, endpoint strings, fetch clients, or S3 SDKs from `view/**`.
- Do not import generated DTOs, raw payloads, gateway, mapper, or S3 SDKs from `api/controller/**`.
- Do not store server DTOs in Zustand.
- Do not let image bytes enter `AdminService.createQuestion` or question save payloads.
- Do not build participant/player URLs in view components. Use `AdminUrlBuilder` through controller/service wiring.

## Feature Defaults

- Auth: USER and ADMIN can enter; unsupported roles are blocked. Signup creates a normal USER and never promotes ADMIN.
- Votes: list/detail/create/update/status/delete use `AdminVote` only above service.
- Questions: upload first, then save `imageUrl` and `imageRatio`; preserve upload result when API save fails.
- Diagnostics: show only non-secret config and distinguish CORS, auth, S3, public API failures.
- QR/player: QR payload is the participant URL. Player URL is `/display/{voteId}`.

## Completion Check

Run the available verification commands for the changed surface, typically typecheck, unit tests, component tests, and build. If scripts are not yet present, add focused tests with the feature or state that verification is blocked by missing scaffold.
