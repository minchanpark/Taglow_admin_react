---
name: taglow-upload-share
description: "Implement or debug Taglow question image upload, imageRatio handling, participant URL generation, QR preview/export, player URL launch/copy, clipboard/download fallbacks, and public API quick check behavior."
---

# Taglow Upload and Share

## Scope

Use this skill for the field-operations path after a vote exists: select a question image, upload it, save question metadata, generate participant link/QR, open player URL, and verify public display/questions APIs.

## Image Flow

1. Accept only `image/jpeg`, `image/png`, and `image/webp` unless the PRD changes.
2. Enforce the configured max size, defaulting to 10MB.
3. Read image width and height with `createImageBitmap` or `HTMLImageElement`.
4. Compute `imageRatio = width / height`.
5. Upload bytes through `QuestionImageUploadService`.
6. Save question with `voteId`, `title`, `detail`, `imageUrl`, and `imageRatio` only.
7. If upload succeeds and API save fails, preserve the upload result and offer save retry.

## Upload Implementations

- Prefer presigned URL upload when the backend provides it.
- Use Cognito direct S3 upload only with short-lived credentials and prefix-restricted permissions.
- Never place long-lived AWS access keys or secret keys in frontend code, env examples, tests, or fixtures.
- Keep S3 upload errors distinct from API save errors.

## URL, QR, and Player Rules

- Participant URL: `{TAGLOW_PARTICIPANT_BASE_URL}/e/{voteId}`.
- QR payload: exactly the participant URL, no secret.
- Player URL: `{TAGLOW_PLAYER_BASE_URL}/display/{voteId}`.
- QR default export: PNG, 1024px, `taglow-{voteId}-participant-qr.png`.
- QR export fallback: SVG or participant URL copy.
- Player open: `window.open(url, '_blank', 'noopener,noreferrer')` behind `ExternalLinkLauncher`.
- Popup fallback: copy player URL.

## Testing Focus

Cover image type/size validation, image ratio calculation, upload success/API failure split, URL construction, QR payload, QR fallback, clipboard fallback, and player popup fallback.
