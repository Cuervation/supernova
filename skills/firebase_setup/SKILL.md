---
name: firebase_setup
description: "Trigger: Firebase setup, Firebase Auth, Firestore. Configure Firebase only as Supernova infrastructure adapter."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use when configuring Firebase Auth or Firestore for the MVP.

## Hard Rules

- Firebase belongs only under `infrastructure/firebase`.
- UI, gameplay, timer, services, and ports must not import Firebase SDKs.
- Implement `AuthPort` and/or `RankingPort`; do not change ports to fit Firebase.
- Store config through environment variables, never hardcoded secrets.

## Decision Gates

| Need | Adapter |
|---|---|
| Login | `FirebaseAuthProvider` implements `AuthPort` |
| Ranking | `FirebaseRankingProvider` implements `RankingPort` |
| Schema change | Update `contracts/firestore.schema.json` first |

## Execution Steps

1. Read auth, ranking, provider, and Firestore contracts.
2. Create Firebase initialization isolated from UI.
3. Normalize Firebase user/result data into internal contracts.
4. Document required env vars and indexes.
5. Verify no Firebase imports leak outside infrastructure.

## Output Contract

Return adapter files, env vars, contracts touched, and leak-check result.

## References

- `contracts/auth.schema.json`
- `contracts/ranking.schema.json`
- `contracts/firestore.schema.json`
