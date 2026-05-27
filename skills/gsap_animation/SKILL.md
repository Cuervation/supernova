---
name: gsap_animation
description: "Trigger: GSAP, animation, motion. Add premium Supernova animations safely."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Activation Contract

Use when adding or changing GSAP animation.

## Hard Rules

- Animation supports UX; it must not hide state or block core actions.
- Respect reduced-motion preferences.
- Keep timelines scoped to the screen/component lifecycle.
- Do not encode business state inside animation timelines.
- Use tokenized durations/easing when available.

## Decision Gates

| Context | Animation rule |
|---|---|
| Home hero | Premium entrance, glow, subtle depth |
| Game | Feedback must be fast and readable |
| Result | Celebratory but not noisy |

## Execution Steps

1. Define the user perception goal.
2. Scope selectors/refs to the component.
3. Add cleanup on unmount.
4. Provide reduced-motion fallback.
5. Verify no layout jump on mobile.

## Output Contract

Return animation intent, affected elements, fallback behavior, and files changed.

## References

- `SPEC.md`
- `contracts/design-tokens.schema.json`
