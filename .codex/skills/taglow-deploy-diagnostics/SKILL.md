---
name: taglow-deploy-diagnostics
description: "Prepare or debug Taglow Admin deployment and diagnostics. Use for Vite env setup, Firebase Hosting config, SPA rewrites, cache headers, Spring CORS/cookie checks, S3 CORS, public display/questions quick checks, player route checks, and deployment readiness."
---

# Taglow Deploy Diagnostics

## Deployment Targets

The React app builds to `dist/` and deploys to Firebase Hosting. All app routes must rewrite to `/index.html`.

Expected hosting basics:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

## Environment Policy

Use Vite `VITE_` variables for public runtime configuration:

- `VITE_TAGLOW_API_BASE_URL`
- `VITE_TAGLOW_PARTICIPANT_BASE_URL`
- `VITE_TAGLOW_PLAYER_BASE_URL`
- `VITE_TAGLOW_USE_MOCK_SERVICE`
- `VITE_TAGLOW_VOTE_CREATE_PATH`
- S3 region, bucket, public base URL, prefix, and Cognito identity pool id when applicable.

Never include long-lived AWS keys, cookies, passwords, private tokens, or session secrets.

## Diagnostic Checks

- Firebase deep links: `/login`, `/votes`, `/votes/{voteId}`, `/diagnostics`.
- Spring CORS: Firebase admin origin in allowlist, credentials allowed, cookie policy valid.
- Auth: login, session probe, logout.
- S3: upload origin allowed, method/headers exposed enough for chosen upload flow.
- Public APIs: `/api/public/votes/{voteId}/display` and `/api/public/votes/{voteId}/questions`.
- Player: `{playerBaseUrl}/display/{voteId}` opens in a new tab.
- Participant: `{participantBaseUrl}/e/{voteId}` is what QR encodes.

## Diagnostics UI

Show non-secret config and safe categorized results. Keep endpoint and raw error detail concise; avoid leaking cookies, tokens, headers, or private bucket policy.

## Verification

Run build before deployment. After deployment, test deep link refresh and the full operator flow from login to public API quick check.
