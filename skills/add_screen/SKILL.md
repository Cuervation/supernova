---
name: add_screen
description: "Trigger: add screen, new screen, pantalla nueva. Add Supernova screens without breaking navigation or contracts."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use when adding or changing a Supernova screen.

## Hard Rules

- Read `SPEC.md` and `contracts/screens.schema.json` first.
- Do not import Firebase or infrastructure adapters from screens.
- Route through internal services and app navigation only.
- Use design tokens; never hardcode loose colors.
- Preserve current flow unless Product Agent updates the spec.

## Decision Gates

| Need | Action |
|---|---|
| Auth required | Mark screen `requiresAuth` and use `AuthService` state |
| Future screen | Add as planned without forcing MVP navigation |
| New data shape | Update contract before implementation |

## Execution Steps

1. Confirm screen id, route, purpose, and auth rule.
2. Update screen contract if needed.
3. Create mobile-first layout.
4. Add loading, empty, and error states when relevant.
5. Run responsive reasoning before handoff.

## Output Contract

Return changed files, screen flow impact, and contract impact.

## References

- `SPEC.md`
- `contracts/screens.schema.json`
