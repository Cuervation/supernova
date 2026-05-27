---
name: add_ranking_screen
description: "Trigger: ranking screen, leaderboard, top 10. Add or update Supernova ranking UI through RankingService."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use when creating or changing the Ranking screen.

## Hard Rules

- Ranking UI uses `RankingService`, never Firestore directly.
- Show top 10 global ordered by lower time.
- Show current user's best time when available.
- Handle loading, empty, error, and unauthenticated states.
- Use tokenized premium card styles.

## Decision Gates

| Data need | Source |
|---|---|
| Top global | `RankingService.getTopGlobal(10)` |
| User best | `RankingService.getBestForUser(uid)` |
| Save attempt | Result flow, not Ranking screen |

## Execution Steps

1. Confirm screen contract and auth requirement.
2. Fetch ranking through service methods.
3. Render readable time and player identity.
4. Preserve mobile-first layout.
5. Verify no provider imports leak into UI.

## Output Contract

Return files changed, service methods used, states covered, and responsive notes.

## References

- `SPEC.md`
- `contracts/ranking.schema.json`
