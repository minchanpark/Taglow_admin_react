# components Agent Guide

`src/components` contains app-wide reusable UI primitives and layouts.

## Responsibilities

- Shared buttons, fields, messages, mobile shell, auth/admin layout, modal primitives.
- Components here must stay domain-light and receive feature behavior through props.
- Keep reusable component styles colocated with the component CSS file and use shared CSS variables from `src/app/App.css`.

## Restrictions

- Do not import gateway, mapper, generated API files, endpoint constants, fetch clients, or storage SDKs.
- Avoid feature-specific business logic; put screen-specific components under `src/view/<screen>/components`.
