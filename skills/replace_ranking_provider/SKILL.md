---
name: replace_ranking_provider
description: "Trigger: replace ranking provider, API ranking, SQL ranking. Swap ranking storage without touching UI."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use when replacing Firestore ranking with another storage/backend.

## Hard Rules

- Keep `RankingPort` stable unless SDD approves a contract change.
- Persist all completed attempts.
- Top 10 must sort by smallest `durationMs`.
- Best user time must be provider-independent.
- Screens must keep using `RankingService`.
- Do not call Firestore/API/SQL clients from screens.
- Do not couple timer logic to persistence.
- Change active ranking provider only in `src/providers/appProviders.ts`.

## Decision Gates

| Provider | Requirement |
|---|---|
| ApiRankingProvider | API owns persistence and query semantics |
| SqlRankingProvider | SQL schema preserves game result fields |
| CorporateRankingProvider | Corporate backend maps attempts to `RankingEntry` |
| BackendRankingProvider | Backend may add server-side timer validation |
| MockRankingProvider | Test ranking flow without external infrastructure |

## Execution Steps

1. Read `docs/REPLACE_PROVIDERS.md`, ranking, and result contracts.
2. Implement provider adapter.
3. Map external data to internal `GameResult`.
4. Update composition root only.
5. Search for forbidden provider imports outside infrastructure.
6. Run `npm run typecheck` and ranking flow checks.
7. Document migration and query/index needs.

## Output Contract

Return adapter changed, ranking behavior compatibility, and UI impact; UI impact should be none.

## References

- `contracts/ranking.schema.json`
- `contracts/game-result.schema.json`
- `contracts/provider-contract.schema.json`
- `docs/REPLACE_PROVIDERS.md`
