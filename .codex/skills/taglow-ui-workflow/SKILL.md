---
name: taglow-ui-workflow
description: "Build Taglow Admin operator-facing React UI. Use when implementing or refining login, signup, vote list/detail/create screens, question editor, diagnostics, shared admin components, dense desktop/tablet layouts, loading/error/empty states, or UI accessibility."
---

# Taglow UI Workflow

## Product Posture

Build a working operations console, not a landing page. Prioritize dense, scannable desktop/tablet workflows for field operators preparing votes, question images, participant QR, and player links.

## Workflow

1. Read the nearest `src/view/**/AGENTS.md`.
2. Identify the operator task and the controller hook that owns behavior.
3. Use domain models and controller view models only.
4. Render all expected states: loading, empty, error, retry, dirty, saving, disabled, success, and fallback.
5. Put browser/network/upload side effects behind callbacks supplied by controller/service.
6. Add focused component tests for states and critical actions.

## Screen Guidance

- Auth: simple forms, validation, safe messages, no long-lived password state.
- Vote list: quick scan, create action, status/search/filter when supported, retry and empty state.
- Vote detail: vote summary, status control, question list, and prominent operation link panel.
- Question editor: image picker, preview, ratio display, upload/API failure separation.
- Diagnostics: non-secret config plus clear health categories for API, auth, CORS, S3, public API, and player route.

## UI Rules

- Use compact headings inside panels and controls; reserve large type for true page titles.
- Prefer icon plus text buttons for operational commands.
- Keep cards for repeated items, modals, and framed tools; avoid nested cards.
- Keep text within containers across mobile and desktop.
- Do not expose server DTO names or endpoint details as operator-facing copy unless the diagnostics task explicitly needs a safe technical hint.

## Forbidden Imports

Do not import gateway, mapper, generated API files, endpoint constants, fetch clients, or storage SDKs from view files.
