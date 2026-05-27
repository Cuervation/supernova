---
name: create_component
description: "Trigger: create component, UI component, componente. Create token-driven Supernova components."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use when creating reusable UI components for Supernova.

## Hard Rules

- Components must be presentation-focused and composable.
- No Firebase imports, routing decisions, or business rules inside generic components.
- Use design tokens for color, radius, spacing, shadow, typography, and motion.
- Keep accessibility states visible: focus, disabled, loading where applicable.

## Decision Gates

| Component type | Rule |
|---|---|
| Button/card/input | Tokenized visual variants only |
| Game card | May receive game state as props, not mutate global state directly |
| Screen-only block | Keep local unless reused twice |

## Execution Steps

1. Define component responsibility in one sentence.
2. Define props from contracts or screen needs.
3. Implement mobile-first styles with tokens.
4. Keep animations opt-in or externally controlled.
5. Document usage if behavior is non-obvious.

## Output Contract

Return changed files, props contract, and token usage notes.

## References

- `contracts/design-tokens.schema.json`
