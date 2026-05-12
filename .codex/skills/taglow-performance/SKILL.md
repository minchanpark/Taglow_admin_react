---
name: taglow-performance
description: "Profile and optimize Taglow Admin React performance. Use for Vite bundle size, React rendering, TanStack Query caching, large vote/question lists, image preview/upload memory, QR rendering/export cost, diagnostics checks, or Firebase-hosted runtime performance."
---

# Taglow Performance

## Performance Priorities

Optimize for repeated operator workflows: fast login-to-votes, responsive vote detail, smooth question editor image preview, reliable QR export, and low bundle overhead.

## Workflow

1. Measure before changing. Use build output, browser profiler, React profiler, network waterfall, and test timing as available.
2. Identify whether the bottleneck is network, rendering, bundle, image handling, QR generation, or cache invalidation.
3. Fix the owning layer without breaking architecture boundaries.
4. Re-run the same measurement and note the delta.

## Common Improvements

- TanStack Query: choose stable query keys, avoid unnecessary invalidation, tune stale time for diagnostics/public previews.
- Rendering: split heavy widgets, memoize derived lists only when profiling shows benefit, avoid recreating callback-heavy props in large grids.
- Lists: keep vote/question rows compact; introduce pagination or virtualization only when data volume justifies it.
- Images: avoid keeping `Uint8Array` bytes in React/Zustand; revoke object URLs; avoid full-size previews when thumbnails suffice.
- QR: render preview at UI size and export at requested size only on demand.
- Bundle: lazy-load rarely used diagnostics/upload/provider-heavy paths when it does not hurt core workflow.
- CSS: prefer stable layout dimensions to prevent interaction-induced layout shifts.

## Guardrails

Do not bypass `AdminService`, gateway, mapper, or controller boundaries for speed. Do not cache raw server DTOs in Zustand. Do not hide real loading/error states to make the UI seem faster.

## Verification

Run build/typecheck/tests and compare bundle or profiling output when available. Add regression tests when optimization changes query keys, memoization behavior, image lifecycle, or lazy routes.
