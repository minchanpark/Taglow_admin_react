# Taglow Skills Agent Guide

`.codex/skills` contains repo-local Codex skills for this project. Keep these skills concise and task-oriented so future agents can load only the workflow they need.

## Rules

- Use lowercase hyphenated skill names.
- Every skill must have a `SKILL.md` with only `name` and `description` in YAML frontmatter.
- Keep the trigger context in the frontmatter `description`; keep the body focused on procedure and project-specific guardrails.
- Prefer referencing `dev/Taglow_admin_React_PRD.md`, `dev/Taglow_admin_React_TDD.md`, and `AGENTS.md` instead of duplicating long specs.
- If a skill changes substantially, run `quick_validate.py` from the system `skill-creator` skill.

## Catalog

- `taglow-implement-feature`: implementation workflow.
- `taglow-api-boundary`: service/gateway/mapper/OpenAPI workflow.
- `taglow-ui-workflow`: operator-focused UI workflow.
- `taglow-upload-share`: image upload, QR, participant/player workflow.
- `taglow-debug`: debugging workflow.
- `taglow-security-hardening`: security review and defensive implementation.
- `taglow-test-suite`: testing strategy and regressions.
- `taglow-performance`: performance checks and optimization.
- `taglow-deploy-diagnostics`: deployment and runtime diagnostics.
- `taglow-review-quality`: review, quality gate, and release readiness.
