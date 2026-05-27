---
name: responsive_check
description: "Trigger: responsive, mobile, desktop check. Validate Supernova mobile-first layouts."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use before accepting screen or layout work.

## Hard Rules

- Mobile first is mandatory.
- Mobile must occupy the full screen cleanly.
- Desktop should center the experience and may preserve a mobile-like ratio.
- No horizontal scroll unless intentionally documented.
- Interactive targets must remain usable on touch.

## Decision Gates

| Breakpoint | Validation |
|---|---|
| Small mobile | Primary CTA visible and usable |
| Tall mobile | Content does not feel lost or top-heavy |
| Desktop | Layout centered, elegant, not stretched awkwardly |

## Execution Steps

1. Inspect critical screens: Home, Login, Game, Result, Ranking.
2. Check spacing, overflow, typography, and CTA reachability.
3. Verify token usage for responsive values.
4. Report blockers before polish suggestions.

## Output Contract

Return pass/fail, viewport concerns, and minimal fixes.

## References

- `SPEC.md`
- `contracts/screens.schema.json`
