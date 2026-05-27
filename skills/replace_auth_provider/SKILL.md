---
name: replace_auth_provider
description: "Trigger: replace auth provider, SSO, corporate auth. Swap Supernova authentication without touching UI."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use when replacing Firebase Auth with another provider.

## Hard Rules

- Keep `AuthPort` stable unless SDD approves a contract change.
- New provider must return normalized `AuthUser`.
- Screens and gameplay must not change for provider-specific reasons.
- Provider-specific errors must be mapped to internal auth errors.
- Do not import Firebase, SSO SDKs, or API clients from UI/screens/hooks.
- Change active auth provider only in `src/providers/appProviders.ts`.

## Decision Gates

| Provider | Requirement |
|---|---|
| CorporateAuthProvider | Corporate identity mapped to `uid`, `email`, `displayName` |
| ApiAuthProvider | API session lifecycle hidden behind `AuthPort` |
| SSOAuthProvider | Redirect/callback details isolated in adapter |
| MockAuthProvider | Test auth flow without external infrastructure |

## Execution Steps

1. Read `docs/REPLACE_PROVIDERS.md`, `contracts/auth.schema.json`, and provider contract.
2. Implement provider adapter.
3. Wire dependency injection/composition root only.
4. Search for forbidden provider imports outside infrastructure.
5. Run `npm run typecheck` and auth flow checks.
6. Document migration decision.

## Output Contract

Return adapter changed, composition change, compatibility notes, and UI impact; UI impact should be none.

## References

- `SPEC.md`
- `docs/REPLACE_PROVIDERS.md`
- `contracts/auth.schema.json`
- `contracts/provider-contract.schema.json`
